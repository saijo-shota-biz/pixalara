<?php

namespace App\Http\Controllers;

use App\Comment;
use App\Http\Requests\StoreComment;
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
    $this->middleware('auth')->except(["index", "show", "download"]);
  }

  public function index()
  {
    $photos = Photo::with(["owner", "likes"])
      ->orderBy(Photo::CREATED_AT, "desc")
      ->paginate();

    return $photos;
  }

  public function show(string $id) {
    $photo = Photo::where('id', $id)->with(['owner', 'comments.author', "likes"])->first();

    return $photo ?? abort(404);
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

  public function addComment(Photo $photo, StoreComment $request)
  {
    $comment = new Comment();
    $comment->content = $request->get("content");
    $comment->user_id = Auth::user()->id;
    $photo->comments()->save($comment);

    $new_comment = Comment::where('id', $comment->id)->with('author')->first();

    return response($new_comment, 201);
  }

  public function like(string $id)
  {
    $photo = Photo::where("id", $id)->with("likes")->first();

    if (!$photo) {
      abort(404);
    }

    $photo->likes()->detach(Auth::user()->id);
    $photo->likes()->attach(Auth::user()->id);

    return ["photo_id" => $id];
  }

  public function unlike(string $id)
  {
    $photo = Photo::where("id", $id)->with("likes")->first();

    if (!$photo) {
      abort(404);
    }

    $photo->likes()->detach(Auth::user()->id);

    return ["photo_id" => $id];
  }
}
