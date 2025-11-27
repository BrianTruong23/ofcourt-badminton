
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../lib/supabase/server';
import { getStoreId } from '../../../lib/store';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await req.json();
    const { customer_email, customer_name, total_price, items } = body;

    // Input validation
    if (!customer_email || total_price === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: customer_email, customer_name, total_price' },
        { status: 400 }
      );
    }

    // Identify store
    const storeSlug = 'badminton';
    const storeId = await getStoreId(storeSlug);

    if (!storeId) {
      console.error(`Store not found for slug: ${storeSlug}`);
      return NextResponse.json(
        { error: 'Store configuration error' },
        { status: 500 }
      );
    }

    console.log(`Creating order for store: ${storeSlug} (ID: ${storeId})`);

    // Get user if logged in
    const { data: { user } } = await supabase.auth.getUser();

    // Insert order
    const { data, error } = await supabase
      .from('orders')
      .insert({
        store_id: storeId,
        customer_email,
        customer_name,
        total_price,
        currency: 'USD',
        status: 'pending',
        // user_id removed as it does not exist in schema
      })
      .select()
      .single();

    if (error) {
      console.error('Error inserting order:', error);
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      );
    }

    console.log('Order created successfully:', data.id);

    // Insert order items if provided
    if (items && items.length > 0) {
      const orderItems = items.map((item: any) => ({
        order_id: data.id,
        store_id: storeId,
        product_name: item.title || item.name,
        quantity: item.quantity || 1,
        unit_price: item.price || 0,
        currency: 'USD',
        line_total: (item.quantity || 1) * (item.price || 0)
      }));

      const { error: itemsError } = await supabase
        .from('order_products')
        .insert(orderItems);

      if (itemsError) {
        console.error('Error inserting order items:', itemsError);
        // We don't fail the whole request if items fail, but we log it
      }
    }

    console.log('Order created successfully:', data.id);

    return NextResponse.json({ success: true, order: data }, { status: 201 });
  } catch (err) {
    console.error('Unexpected error in create-order:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
