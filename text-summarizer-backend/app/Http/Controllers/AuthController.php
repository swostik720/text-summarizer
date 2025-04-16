<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        return response()->json([
            'message' => 'User registered successfully',
            'user' => $user
        ], 201);
    }

    public function login(Request $request)
    {
        // Check credentials using attempt method
        if (Auth::attempt(['email' => $request->email, 'password' => $request->password])) {
            $user = Auth::user();

            $loginToken = $user->createToken('API Token')->plainTextToken;

            // Check if the user is an admin
            if ($user->is_admin) {
                return response()->json(['message' => 'Logged in successfully. Welcome admin', 'loginToken' => $loginToken], 200);
            } else {
                return response()->json(['message' => 'Logged in successfully. Welcome ' . $user->name,  'loginToken' => $loginToken], 200);
            }
        }

        // If authentication fails
        return response()->json(['message' => 'Invalid credentials'], 401);
    }

    public function logout(Request $request)
    {
        // Log out the user
        $user = $request->user();
        $user->currentAccessToken()->delete();

        return response()->json([
            'message' => 'User logged out successfully'
        ], 200);
    }

    public function sendPasswordResetLink(Request $request)
    {
       // Check if the user exists
       $user = User::where('email', $request->email)->first();

       if (!$user) {
           return response()->json(['message' => 'No user found with that email.'], 404);
       }

       // Create a unique token for the password reset
       $passwordResetToken = Str::random(60);

       // Store this token in the database (optional - useful for tracking resets)
       DB::table('password_resets')->insert([
           'email' => $request->email,
           'token' => $passwordResetToken,
           'created_at' => now(),
        ]);

       // Create custom reset link for the frontend
    //    $resetUrl = config('app.frontend_url') . '/createnewpassword?token=' . $passwordResetToken . '&email=' . urlencode($request->email);
    $resetUrl = config('app.frontend_url') . '/createnewpassword?token=' . $passwordResetToken . '&email=' . urlencode($request->email);

    //    dd(config('app.frontend_url'));

       // Send raw email with custom message
       Mail::raw("To reset your password, click the following link: $resetUrl", function ($message) use ($request) {
           $message->to($request->email)
               ->subject('Password Reset Request');
       });

       return response()->json([
           'message' => 'Password reset link sent to your email.',
           'passwordResetToken' => $passwordResetToken,
       ], 200);
    }

    public function resetPassword(Request $request)
    {
        // Check if the reset token exists in the database
        $reset = DB::table('password_resets')
            ->where('email', $request->email)
            ->where('token', $request->token)
            ->first();

        if (!$reset) {
            dd($request->passwordResetToken);
            return response()->json(['message' => 'Invalid or expired reset token.'], 400);
        }

        // Update the user's password
        $user = User::where('email', $request->email)->first();

        if ($user) {
            $user->password = bcrypt($request->password);
            $user->save();

            // Optionally delete the reset token after use
            DB::table('password_resets')->where('email', $request->email)->delete();

            return response()->json([
                'message' => 'Password reset successful.',
            ], 200);
        }

        return response()->json(['message' => 'User not found.'], 404);

    }
}
