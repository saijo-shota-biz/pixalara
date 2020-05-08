<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class RegisterApiTest extends TestCase
{
  use RefreshDatabase;

  /**
   * @test
   */
  public function should_register_user_and_return_userId()
  {
    $data = [
      'name' => 'テスト',
      'email' => 'test@example.com',
      'password' => 'test1234',
      'password_confirmation' => 'test1234',
    ];

    $response = $this->json('POST', route('register'), $data);

    $user = DB::table("users")->first();
    $response
      ->assertStatus(201)
      ->assertJson(["id"=>$user->id]);
  }
}
