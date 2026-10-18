import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('fish_records')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json([], { status: 200 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { species, length, weight, sex, gearType, location, latitude, longitude, image_url } = body;

    const parsedLength = parseFloat(length);
    const parsedWeight = parseFloat(weight);

    if (!species || typeof species !== 'string' || species.trim() === '') {
      return NextResponse.json({ error: "Invalid or missing species" }, { status: 400 });
    }
    if (isNaN(parsedLength) || parsedLength <= 0 || parsedLength > 10000) {
      return NextResponse.json({ error: "Invalid length" }, { status: 400 });
    }
    if (isNaN(parsedWeight) || parsedWeight <= 0 || parsedWeight > 100000) {
      return NextResponse.json({ error: "Invalid weight" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('fish_records')
      .insert({
        user_id: session.user.id,
        species,
        length,
        weight,
        sex,
        gear_type: gearType,
        location,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        image_url
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Trigger n8n Webhook asynchronously if configured
    const webhookUrl = request.headers.get("x-webhook-url");
    if (webhookUrl) {
      fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: "record.created",
          data,
        }),
      }).catch((err) => console.error("Failed to trigger webhook:", err));
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("POST /api/records error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const { error } = await supabase
      .from('fish_records')
      .delete()
      .eq('id', id)
      .eq('user_id', session.user.id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/records error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
