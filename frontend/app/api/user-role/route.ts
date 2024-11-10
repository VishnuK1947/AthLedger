import { currentUser } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const { role } = await req.json();

    if (!role) {
      return new Response(JSON.stringify({ error: "Role is required" }), {
        status: 400,
      });
    }

    // Here you would typically update the user's role in your database
    return new Response(JSON.stringify({ 
      success: true, 
      userId: user.id,
      role: role 
    }), {
      status: 200,
    });

  } catch (error) {
    console.error('Error in user role API:', error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}