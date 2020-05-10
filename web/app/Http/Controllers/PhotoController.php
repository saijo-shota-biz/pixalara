<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePhoto;
use App\Photo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class PhotoController extends Controller
{
  public function __construct()
  {
    // 認証が必要
    $this->middleware('auth');
  }

  public function create(StorePhoto $request)
  {
    $extension = $request->photo->extension();

    $photo = new Photo();
    $photo->filename = "{$photo->id}.{$extension}";

    Storage::disk("local")
      ->putFileAs("", $request->photo, $photo->filename, "public");

    DB::beginTransaction();

    try {
      Auth::user()->photos()->save($photo);
      DB::commit();
    } catch (\Exception $e) {
      DB::rollBack();
      Storage::disk("local")->delete($photo->filename);
      throw $e;
    }

    return response($photo, 201);
  }
}