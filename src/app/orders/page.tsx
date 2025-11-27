import { createClient } from '../../lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import styles from './orders.module.css'

export default async function OrdersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // 1. Get the store_id associated with the user (where role is 'client')
  const { data: serviceUser } = await supabase
    .from('service_users')
    .select('store_id')
    .eq('id', user.id) // service_users.id references auth.users.id
    .eq('role', 'client')
    .single()

  let orders = []
  let error = null

  if (serviceUser?.store_id) {
    // 2. Fetch orders for this user (by email) and store
    const result = await supabase
      .from('orders')
      .select('*')
      .eq('customer_email', user.email)
      .eq('store_id', serviceUser.store_id)
      .order('created_at', { ascending: false })
    
    orders = result.data
    error = result.error
  } else {
    // Fallback: just fetch by email if no service_user record found (e.g. guest checkout previously)
    // OR maybe we shouldn't show anything? The requirement was specific about linking via service_users.
    // Let's try fetching by email only as a fallback, but maybe log a warning.
    // Actually, the user said "Orders that has store_id that links to store_id of the service_users where the role is client."
    // This implies strict filtering.
    // However, for a better UX, if I bought something as a guest and then logged in, I might expect to see it.
    // But let's stick to the strict requirement first to fix the error.
    
    // If no service user record, we can't determine the "correct" store context as per requirement.
    // But we can try to find orders by email anyway, assuming the user might have orders from ANY store?
    // Let's stick to the requirement: link via service_users.
    console.log('No service_user record found for user:', user.id)
  }

  // Handle case where orders table might not have been queried properly
  const ordersList = orders || []
  const hasError = error && error.code !== 'PGRST116' // PGRST116 is "no rows returned", which is OK


  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Order History</h1>
        <p>View all your past orders</p>
      </div>

      {hasError && (
        <div className={styles.error}>
          Error loading orders: {error.message}. 
          {error.code === '42P01' && ' (The orders table may not exist yet. Please run the SQL schema in Supabase.)'}
        </div>
      )}

      {!hasError && ordersList.length === 0 && (
        <div className={styles.empty}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          <h2>No orders yet</h2>
          <p>Start shopping and your orders will appear here!</p>
          <Link href="/shop" className={styles.shopButton}>
            Browse Products
          </Link>
        </div>
      )}

      {!hasError && ordersList.length > 0 && (
        <div className={styles.ordersList}>
          {ordersList.map((order) => (
            <div key={order.id} className={styles.orderCard}>
              <div className={styles.orderHeader}>
                <div>
                  <h3>Order #{order.id.slice(0, 8)}</h3>
                  <p className={styles.orderDate}>
                    {new Date(order.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div className={styles.orderTotal}>
                  ${order.total_price.toFixed(2)}
                </div>
              </div>
              <div className={styles.orderDetails}>
                <div className={styles.detailRow}>
                  <span className={styles.label}>Email:</span>
                  <span>{order.customer_email}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.label}>Store:</span>
                  <span>OfCourt Badminton</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
