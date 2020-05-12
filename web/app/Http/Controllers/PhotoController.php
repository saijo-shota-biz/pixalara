<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePhoto;
use App\Photo;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class PhotoController extends Controller
{
  public function __construct()
  {
    // 認証が必要
    $this->middleware('auth')->except(["index", "download"]);
  }

  public function index()
  {
    $photos = Photo::with(["owner"])
      ->orderBy(Photo::CREATED_AT, "desc")
      ->paginate();

    return $photos;
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

  public function download(Photo $photo)
  {
    if (!Storage::disk("local")->exists($photo->filename)) {
      abort(404);
    }

    $disposition = 'attachment; filename="' . $photo->filename . '"';
    $headers = [
      'Content-Type' => 'application/octet-stream',
      'Content-Disposition' => $disposition,
    ];

    return response(Storage::disk("local")->get($photo->filename), 200, $headers);
  }
}
