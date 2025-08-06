import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nickname, email, full_name, password } = body;

    if (!nickname || !email || !password) {
      return NextResponse.json(
        { error: 'Nickname, email, and password are required' },
        { status: 400 }
      );
    }

    // Check if user with email already exists
    const existingEmail = await prisma.user.findFirst({
      where: { email }
    });

    if (existingEmail) {
      return NextResponse.json(
        { error: 'Email already in use' },
        { status: 400 }
      );
    }

    // Check if user with nickname already exists
    const existingNickname = await prisma.user.findFirst({
      where: { nickname }
    });

    if (existingNickname) {
      return NextResponse.json(
        { error: 'Nickname already in use' },
        { status: 400 }
      );
    }

    // Hash the password
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Create the user
    const user = await prisma.user.create({
      data: {
        nickname,
        email,
        full_name,
        password_hash,
        email_verified: false
      }
    });

    // Return success without sensitive data
    return NextResponse.json(
      { 
        success: true,
        user: {
          id: user.id,
          nickname: user.nickname,
          email: user.email,
          full_name: user.full_name,
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}
