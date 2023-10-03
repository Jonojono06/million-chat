import { NextApiResponse } from 'next';
import Clerk from '@clerk/clerk-sdk-node';
import { NextResponse } from 'next/server';

export async function PATCH(req: Request, res: NextResponse) {
    if (req.method !== 'PATCH') {
        // return res.status(405).end(); // Method Not Allowed
        return new NextResponse(null, { status: 405 });
    }

    try {
        const { userId, roleValue } = await req.json();


        if (!userId) {
            return new NextResponse('User ID must be provided', { status: 400 });
        }

        // Update the user's metadata
        const updatedUser = await Clerk.users.updateUser(userId, {
            publicMetadata: {
                // ...user.publicMetadata,
                role: roleValue
            },
        });

        // return res.status(200).json({ message: 'Metadata updated successfully', publicMetadata: updatedUser.publicMetadata });
        return new NextResponse(JSON.stringify({
            message: 'Metadata updated successfully',
            publicMetadata: updatedUser.publicMetadata
        }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
        console.error(error);
        // return res.status(500).json({ message: 'Internal Server Error' });
        return new NextResponse('Internal Server Error', { status: 500 });
    }

}
