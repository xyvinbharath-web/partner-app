"use client";

import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addPlaylistMaterial,
  addPlaylistVideo,
  CoursePlaylist,
  deletePlaylistMaterial,
  deletePlaylistVideo,
  getCoursePlaylist,
  saveCoursePlaylist,
  updatePlaylistMaterial,
  updatePlaylistVideo,
} from "@/services/partner/courses";
import {
  uploadCourseMaterial,
  uploadCourseThumbnail,
  uploadCourseVideo,
} from "@/services/partner/uploads";
import { FormEvent, useEffect, useState } from "react";

export default function PartnerCoursePlaylistPage() {
  const params = useParams<{ courseId: string }>();
  const courseId = params.courseId;
  const queryClient = useQueryClient();

  const { data: playlist, isLoading } = useQuery<CoursePlaylist | null>({
    queryKey: ["partner-course-playlist", courseId],
    queryFn: () => getCoursePlaylist(courseId),
  });

  const [playlistTitle, setPlaylistTitle] = useState(playlist?.title ?? "Main Playlist");
  const [playlistDescription, setPlaylistDescription] = useState(
    playlist?.description ?? ""
  );

  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);
  const [editingMaterialId, setEditingMaterialId] = useState<string | null>(null);
  const [editingVideoTitle, setEditingVideoTitle] = useState("");
  const [editingVideoDescription, setEditingVideoDescription] = useState("");
  const [editingVideoOrder, setEditingVideoOrder] = useState<number | "">("");
  const [editingMaterialTitle, setEditingMaterialTitle] = useState("");
  const [editingMaterialDescription, setEditingMaterialDescription] = useState("");
  const [editingMaterialOrder, setEditingMaterialOrder] = useState<number | "">("");

  const [newVideoThumbPreview, setNewVideoThumbPreview] = useState<string | null>(null);
  const [newVideoUrlPreview, setNewVideoUrlPreview] = useState<string>("");

  const [previewVideoUrl, setPreviewVideoUrl] = useState<string | null>(null);
  const [previewVideoTitle, setPreviewVideoTitle] = useState<string>("");

  useEffect(() => {
    if (playlist) {
      setPlaylistTitle(playlist.title || "Main Playlist");
      setPlaylistDescription(playlist.description || "");
    }
  }, [playlist]);

  const savePlaylistMutation = useMutation({
    mutationFn: () =>
      saveCoursePlaylist(courseId, {
        title: playlistTitle || "Main Playlist",
        description: playlistDescription,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["partner-course-playlist", courseId],
      });
    },
  });

  const updateVideoMutation = useMutation({
    mutationFn: (vars: { id: string; title?: string; description?: string; order?: number }) =>
      updatePlaylistVideo(courseId, vars.id, {
        title: vars.title,
        description: vars.description,
        order: vars.order,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["partner-course-playlist", courseId],
      });
      setEditingVideoId(null);
    },
  });

  const updateMaterialMutation = useMutation({
    mutationFn: (vars: { id: string; title?: string; description?: string; order?: number }) =>
      updatePlaylistMaterial(courseId, vars.id, {
        title: vars.title,
        description: vars.description,
        order: vars.order,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["partner-course-playlist", courseId],
      });
      setEditingMaterialId(null);
    },
  });

  const addVideoMutation = useMutation({
    mutationFn: async (form: FormData) => {
      const title = String(form.get("title") || "").trim();
      const description = String(form.get("description") || "").trim();
      const urlInput = String(form.get("videoUrl") || "").trim();
      const thumbnailInput = String(form.get("thumbnailUrl") || "").trim();
      const videoFile = form.get("videoFile") as File | null;
      const thumbFile = form.get("thumbFile") as File | null;

      let videoUrl = urlInput;
      if (!videoUrl && videoFile) {
        videoUrl = await uploadCourseVideo(videoFile);
      }

      let thumbnailUrl = thumbnailInput;
      if (!thumbnailUrl && thumbFile) {
        thumbnailUrl = await uploadCourseThumbnail(thumbFile);
      }

      return addPlaylistVideo(courseId, {
        title,
        description,
        videoUrl,
        thumbnailUrl,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["partner-course-playlist", courseId],
      });
    },
  });

  const addMaterialMutation = useMutation({
    mutationFn: async (form: FormData) => {
      const title = String(form.get("title") || "").trim();
      const description = String(form.get("description") || "").trim();
      const urlInput = String(form.get("fileUrl") || "").trim();
      const file = form.get("file") as File | null;

      let fileUrl = urlInput;
      if (!fileUrl && file) {
        fileUrl = await uploadCourseMaterial(file);
      }

      return addPlaylistMaterial(courseId, {
        title,
        description,
        fileUrl,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["partner-course-playlist", courseId],
      });
    },
  });

  const deleteVideoMutation = useMutation({
    mutationFn: (videoId: string) => deletePlaylistVideo(courseId, videoId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["partner-course-playlist", courseId],
      });
    },
  });

  const deleteMaterialMutation = useMutation({
    mutationFn: (materialId: string) => deletePlaylistMaterial(courseId, materialId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["partner-course-playlist", courseId],
      });
    },
  });

  function handlePlaylistSubmit(e: FormEvent) {
    e.preventDefault();
    savePlaylistMutation.mutate();
  }

  async function handleAddVideo(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;
    const form = new FormData(formEl);
    await addVideoMutation.mutateAsync(form);
    formEl.reset();
    setNewVideoThumbPreview(null);
    setNewVideoUrlPreview("");
  }

  async function handleAddMaterial(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;
    const form = new FormData(formEl);
    await addMaterialMutation.mutateAsync(form);
    formEl.reset();
  }

  function beginEditVideo(videoId: string) {
    if (!playlist) return;
    const video = playlist.videos.find((v) => v._id === videoId);
    if (!video) return;
    setEditingVideoId(videoId);
    setEditingVideoTitle(video.title || "");
    setEditingVideoDescription(video.description || "");
    setEditingVideoOrder(typeof video.order === "number" ? video.order : "");
  }

  function beginEditMaterial(materialId: string) {
    if (!playlist) return;
    const material = playlist.materials.find((m) => m._id === materialId);
    if (!material) return;
    setEditingMaterialId(materialId);
    setEditingMaterialTitle(material.title || "");
    setEditingMaterialDescription(material.description || "");
    setEditingMaterialOrder(typeof material.order === "number" ? material.order : "");
  }

  function handleReorderVideo(index: number, direction: "up" | "down") {
    if (!playlist || !playlist.videos) return;
    const videos = [...playlist.videos];
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === videos.length - 1) return;

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const current = videos[index];
    const target = videos[targetIndex];

    updateVideoMutation.mutate({
      id: current._id,
      order: targetIndex,
    });
    updateVideoMutation.mutate({
      id: target._id,
      order: index,
    });
  }

  function handleReorderMaterial(index: number, direction: "up" | "down") {
    if (!playlist || !playlist.materials) return;
    const materials = [...playlist.materials];
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === materials.length - 1) return;

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const current = materials[index];
    const target = materials[targetIndex];

    updateMaterialMutation.mutate({
      id: current._id,
      order: targetIndex,
    });
    updateMaterialMutation.mutate({
      id: target._id,
      order: index,
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold">Course Playlist</h1>
        <p className="text-sm text-slate-500">
          Manage the single playlist for this course: videos and PDF materials.
        </p>
      </div>

      {isLoading && <div className="text-sm text-slate-500">Loading playlist...</div>}

      <section className="rounded-md border bg-white p-4 space-y-3">
        <h2 className="text-sm font-semibold">Playlist details</h2>
        <form onSubmit={handlePlaylistSubmit} className="space-y-3">
          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-700">Title</label>
            <input
              type="text"
              className="w-full rounded-md border px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400"
              value={playlistTitle}
              onChange={(e) => setPlaylistTitle(e.target.value)}
              placeholder="Main Playlist"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-700">Description</label>
            <textarea
              className="w-full rounded-md border px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400"
              rows={3}
              value={playlistDescription}
              onChange={(e) => setPlaylistDescription(e.target.value)}
              placeholder="Short description of what this playlist contains"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800"
            disabled={savePlaylistMutation.isPending}
          >
            {savePlaylistMutation.isPending ? "Saving..." : "Save playlist"}
          </button>
        </form>
      </section>

      <section className="rounded-md border bg-white p-4 space-y-3">
        <h2 className="text-sm font-semibold">Videos</h2>
        <form onSubmit={handleAddVideo} className="grid gap-3 md:grid-cols-2">
          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-700">Title</label>
            <input
              name="title"
              type="text"
              className="w-full rounded-md border px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400"
              required
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-700">Description</label>
            <input
              name="description"
              type="text"
              className="w-full rounded-md border px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-700">Video URL (optional if uploading)</label>
            <input
              name="videoUrl"
              type="url"
              className="w-full rounded-md border px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400"
              placeholder="https://..."
              onChange={(e) => setNewVideoUrlPreview(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-700">Video file (optional)</label>
            <input
              name="videoFile"
              type="file"
              accept="video/*"
              className="block w-full text-xs text-slate-700"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-700">Thumbnail URL (optional if uploading)</label>
            <input
              name="thumbnailUrl"
              type="url"
              className="w-full rounded-md border px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400"
              placeholder="https://..."
              onChange={(e) => setNewVideoThumbPreview(e.target.value || null)}
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-700">Thumbnail image (optional)</label>
            <input
              name="thumbFile"
              type="file"
              accept="image/*"
              className="block w-full text-xs text-slate-700"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) {
                  setNewVideoThumbPreview(null);
                  return;
                }
                const url = URL.createObjectURL(file);
                setNewVideoThumbPreview(url);
              }}
            />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800"
              disabled={addVideoMutation.isPending}
            >
              {addVideoMutation.isPending ? "Adding..." : "Add video"}
            </button>
          </div>
        </form>

        {(newVideoThumbPreview || newVideoUrlPreview) && (
          <div className="mt-3 flex items-center gap-3 rounded-md border border-dashed border-slate-300 bg-slate-50 p-3 text-xs">
            {newVideoThumbPreview && (
              <img
                src={newVideoThumbPreview}
                alt="Thumbnail preview"
                className="h-12 w-12 rounded object-cover"
              />
            )}
            <div className="space-y-1">
              <div className="font-medium text-slate-800">New video preview</div>
              {newVideoUrlPreview && (
                <a
                  href={newVideoUrlPreview}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-slate-600 underline"
                >
                  {newVideoUrlPreview}
                </a>
              )}
              {!newVideoUrlPreview && (
                <div className="text-[11px] text-slate-500">
                  URL will appear here when you type it.
                </div>
              )}
            </div>
          </div>
        )}

        {playlist && playlist.videos && playlist.videos.length > 0 && (
          <div className="mt-4 space-y-2">
            {playlist.videos.map((video, index) => (
              <div
                key={video._id}
                className="flex flex-col gap-2 rounded-md border px-3 py-2 text-sm md:flex-row md:items-center md:justify-between"
              >
                <div className="flex flex-1 items-start gap-3">
                  {video.thumbnailUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        if (video.videoUrl) {
                          setPreviewVideoUrl(video.videoUrl);
                          setPreviewVideoTitle(video.title || "");
                        }
                      }}
                    >
                      <img
                        src={video.thumbnailUrl}
                        alt={video.title}
                        className="h-12 w-12 rounded object-cover"
                      />
                    </button>
                  )}
                  <div className="space-y-1">
                    <button
                      type="button"
                      className="font-medium text-slate-900 hover:underline"
                      onClick={() => {
                        if (video.videoUrl) {
                          setPreviewVideoUrl(video.videoUrl);
                          setPreviewVideoTitle(video.title || "");
                        }
                      }}
                    >
                      {video.title}
                    </button>
                    {video.description && (
                      <div className="text-xs text-slate-500">{video.description}</div>
                    )}
                    {video.videoUrl && (
                      <a
                        href={video.videoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-slate-600 underline"
                      >
                        Open video
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleReorderVideo(index, "up")}
                    className="inline-flex items-center rounded-md border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700 hover:bg-slate-50"
                  >
                    Up
                  </button>
                  <button
                    type="button"
                    onClick={() => handleReorderVideo(index, "down")}
                    className="inline-flex items-center rounded-md border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700 hover:bg-slate-50"
                  >
                    Down
                  </button>
                  <button
                    type="button"
                    onClick={() => beginEditVideo(video._id)}
                    className="inline-flex items-center rounded-md border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700 hover:bg-slate-50"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteVideoMutation.mutate(video._id)}
                    className="inline-flex items-center rounded-md border border-rose-200 bg-white px-2 py-1 text-xs text-rose-700 hover:bg-rose-50"
                  >
                    Delete
                  </button>
                </div>
                {editingVideoId === video._id && (
                  <div className="mt-2 grid w-full gap-2 rounded-md bg-slate-50 p-3 text-xs md:grid-cols-3">
                    <div className="space-y-1">
                      <label className="block text-[11px] font-medium text-slate-700">
                        Title
                      </label>
                      <input
                        type="text"
                        className="w-full rounded-md border px-2 py-1 text-xs text-slate-900 placeholder:text-slate-400"
                        value={editingVideoTitle}
                        onChange={(e) => setEditingVideoTitle(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[11px] font-medium text-slate-700">
                        Description
                      </label>
                      <input
                        type="text"
                        className="w-full rounded-md border px-2 py-1 text-xs text-slate-900 placeholder:text-slate-400"
                        value={editingVideoDescription}
                        onChange={(e) => setEditingVideoDescription(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[11px] font-medium text-slate-700">
                        Order (optional)
                      </label>
                      <input
                        type="number"
                        className="w-full rounded-md border px-2 py-1 text-xs text-slate-900 placeholder:text-slate-400"
                        value={editingVideoOrder}
                        onChange={(e) =>
                          setEditingVideoOrder(
                            e.target.value === "" ? "" : Number(e.target.value)
                          )
                        }
                      />
                    </div>
                    <div className="md:col-span-3 flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        className="inline-flex items-center rounded-md border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700 hover:bg-slate-50"
                        onClick={() => {
                          setEditingVideoId(null);
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center rounded-md bg-slate-900 px-3 py-1 text-xs font-medium text-white hover:bg-slate-800"
                        onClick={() =>
                          updateVideoMutation.mutate({
                            id: video._id,
                            title: editingVideoTitle,
                            description: editingVideoDescription,
                            order:
                              editingVideoOrder === "" ? undefined : Number(editingVideoOrder),
                          })
                        }
                      >
                        Save
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-md border bg-white p-4 space-y-3">
        <h2 className="text-sm font-semibold">Materials (PDF / files)</h2>
        <form onSubmit={handleAddMaterial} className="grid gap-3 md:grid-cols-2">
          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-700">Title</label>
            <input
              name="title"
              type="text"
              className="w-full rounded-md border px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400"
              required
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-700">Description</label>
            <input
              name="description"
              type="text"
              className="w-full rounded-md border px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-700">File URL (optional if uploading)</label>
            <input
              name="fileUrl"
              type="url"
              className="w-full rounded-md border px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400"
              placeholder="https://..."
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-700">File upload (optional)</label>
            <input
              name="file"
              type="file"
              className="block w-full text-xs text-slate-700"
              accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800"
              disabled={addMaterialMutation.isPending}
            >
              {addMaterialMutation.isPending ? "Adding..." : "Add material"}
            </button>
          </div>
        </form>

        {playlist && playlist.materials && playlist.materials.length > 0 && (
          <div className="mt-4 space-y-2">
            {playlist.materials.map((material, index) => (
              <div
                key={material._id}
                className="flex flex-col gap-2 rounded-md border px-3 py-2 text-sm md:flex-row md:items-center md:justify-between"
              >
                <div className="flex flex-1 flex-col gap-1">
                  <div className="font-medium text-slate-900">{material.title}</div>
                  {material.description && (
                    <div className="text-xs text-slate-500">{material.description}</div>
                  )}
                  {material.fileUrl && (
                    <a
                      href={material.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-slate-600 underline"
                    >
                      Open file
                    </a>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleReorderMaterial(index, "up")}
                    className="inline-flex items-center rounded-md border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700 hover:bg-slate-50"
                  >
                    Up
                  </button>
                  <button
                    type="button"
                    onClick={() => handleReorderMaterial(index, "down")}
                    className="inline-flex items-center rounded-md border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700 hover:bg-slate-50"
                  >
                    Down
                  </button>
                  <button
                    type="button"
                    onClick={() => beginEditMaterial(material._id)}
                    className="inline-flex items-center rounded-md border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700 hover:bg-slate-50"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteMaterialMutation.mutate(material._id)}
                    className="inline-flex items-center rounded-md border border-rose-200 bg-white px-2 py-1 text-xs text-rose-700 hover:bg-rose-50"
                  >
                    Delete
                  </button>
                </div>
                {editingMaterialId === material._id && (
                  <div className="mt-2 grid w-full gap-2 rounded-md bg-slate-50 p-3 text-xs md:grid-cols-3">
                    <div className="space-y-1">
                      <label className="block text-[11px] font-medium text-slate-700">
                        Title
                      </label>
                      <input
                        type="text"
                        className="w-full rounded-md border px-2 py-1 text-xs text-slate-900 placeholder:text-slate-400"
                        value={editingMaterialTitle}
                        onChange={(e) => setEditingMaterialTitle(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[11px] font-medium text-slate-700">
                        Description
                      </label>
                      <input
                        type="text"
                        className="w-full rounded-md border px-2 py-1 text-xs text-slate-900 placeholder:text-slate-400"
                        value={editingMaterialDescription}
                        onChange={(e) => setEditingMaterialDescription(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[11px] font-medium text-slate-700">
                        Order (optional)
                      </label>
                      <input
                        type="number"
                        className="w-full rounded-md border px-2 py-1 text-xs text-slate-900 placeholder:text-slate-400"
                        value={editingMaterialOrder}
                        onChange={(e) =>
                          setEditingMaterialOrder(
                            e.target.value === "" ? "" : Number(e.target.value)
                          )
                        }
                      />
                    </div>
                    <div className="md:col-span-3 flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        className="inline-flex items-center rounded-md border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700 hover:bg-slate-50"
                        onClick={() => {
                          setEditingMaterialId(null);
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center rounded-md bg-slate-900 px-3 py-1 text-xs font-medium text-white hover:bg-slate-800"
                        onClick={() =>
                          updateMaterialMutation.mutate({
                            id: material._id,
                            title: editingMaterialTitle,
                            description: editingMaterialDescription,
                            order:
                              editingMaterialOrder === ""
                                ? undefined
                                : Number(editingMaterialOrder),
                          })
                        }
                      >
                        Save
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {previewVideoUrl && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-3xl rounded-md bg-slate-950 p-4 text-slate-50 shadow-lg">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="truncate text-sm font-semibold">
                {previewVideoTitle || "Video preview"}
              </div>
              <button
                type="button"
                className="rounded-md border border-slate-600 px-2 py-1 text-xs hover:bg-slate-800"
                onClick={() => setPreviewVideoUrl(null)}
              >
                Close
              </button>
            </div>
            <div className="aspect-video w-full overflow-hidden rounded-md bg-black">
              <video src={previewVideoUrl || undefined} controls className="h-full w-full" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

