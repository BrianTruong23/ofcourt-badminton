
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../lib/supabase/server';
import { getStoreId } from '../../../lib/store';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await req.json();
    const { customer_email, total_price, items } = body;

    // Input validation
    if (!customer_email || total_price === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: customer_email, total_price' },
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
        total_price,
        user_id: user?.id || null, // Link to user if logged in
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

    return NextResponse.json({ success: true, order: data }, { status: 201 });
  } catch (err) {
    console.error('Unexpected error in create-order:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
