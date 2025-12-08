"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createPartnerCourse,
  getCoursePlaylist,
  getPartnerCourses,
  addPlaylistVideo,
  type CoursePlaylist,
} from "@/services/partner/courses";
import { uploadCourseThumbnail, uploadCourseVideo } from "@/services/partner/uploads";

export default function PartnerCoursesPage() {
  const queryClient = useQueryClient();

  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(null);

  const { data: courses, isLoading } = useQuery({
    queryKey: ["partner-courses"],
    queryFn: getPartnerCourses,
  });

  const { data: expandedPlaylist } = useQuery<CoursePlaylist | null | undefined>({
    queryKey: ["partner-course-playlist-inline", expandedCourseId],
    queryFn: () => (expandedCourseId ? getCoursePlaylist(expandedCourseId) : Promise.resolve(null)),
    enabled: !!expandedCourseId,
  });

  const createCourseMutation = useMutation({
    mutationFn: async (form: FormData) => {
      const title = String(form.get("title") || "").trim();
      const description = String(form.get("description") || "").trim();
      const priceRaw = String(form.get("price") || "").trim();
      const category = String(form.get("category") || "").trim();
      const thumbUrlInput = String(form.get("thumbnailUrl") || "").trim();
      const introVideoUrlInput = String(form.get("introVideoUrl") || "").trim();
      const isCertificateCourse = String(form.get("isCertificateCourse") || "") === "on";
      const thumbnailFile = form.get("thumbnailFile") as File | null;
      const introVideoFile = form.get("introVideoFile") as File | null;

      let thumbnailUrl = thumbUrlInput;
      if (!thumbnailUrl && thumbnailFile) {
        thumbnailUrl = await uploadCourseThumbnail(thumbnailFile);
      }

      let introVideoUrl = introVideoUrlInput;
      if (introVideoFile) {
        introVideoUrl = await uploadCourseVideo(introVideoFile);
      }

      const price = priceRaw ? Number(priceRaw) : undefined;

      return createPartnerCourse({
        title,
        description,
        category: category || undefined,
        price,
        thumbnailUrl,
        introVideoUrl,
        isCertificateCourse,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partner-courses"] });
    },
  });

  const addInlineVideoMutation = useMutation({
    mutationFn: async (payload: { courseId: string; title: string; videoUrl: string }) => {
      return addPlaylistVideo(payload.courseId, {
        title: payload.title,
        description: "",
        videoUrl: payload.videoUrl,
      });
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["partner-course-playlist-inline", variables.courseId],
      });
    },
  });

  async function handleCreateCourse(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;
    const form = new FormData(formEl);
    await createCourseMutation.mutateAsync(form);
    formEl.reset();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Your Courses</h1>
          <p className="text-sm text-slate-500">
            Create and manage your courses and their playlist (videos & materials).
          </p>
        </div>
      </div>

      {/* Create course */}
      <section className="rounded-md border bg-white p-4">
        <h2 className="text-sm font-semibold">Create new course</h2>
        <p className="mb-3 text-xs text-slate-500">
          Add a new course. You can then manage its playlist (videos and materials).
        </p>
        <form onSubmit={handleCreateCourse} className="grid gap-3 md:grid-cols-2">
          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-700">Title</label>
            <input
              name="title"
              type="text"
              required
              className="w-full rounded-md border px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400"
              placeholder="Course title"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-700">Price (optional)</label>
            <input
              name="price"
              type="number"
              min="0"
              step="0.01"
              className="w-full rounded-md border px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400"
              placeholder="0 for free course"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-700">Category</label>
            <select
              name="category"
              className="w-full rounded-md border px-3 py-2 text-sm text-slate-900"
              defaultValue=""
            >
              <option value="" disabled>
                Select category
              </option>
              <option value="Finance">Finance</option>
              <option value="Sales">Sales</option>
              <option value="Business">Business</option>
              <option value="Technology">Technology</option>
            </select>
          </div>
          <div className="space-y-1 md:col-span-2">
            <label className="block text-xs font-medium text-slate-700">Description</label>
            <textarea
              name="description"
              rows={3}
              className="w-full rounded-md border px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400"
              placeholder="Short description of the course"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-700">
              Thumbnail URL (optional if uploading)
            </label>
            <input
              name="thumbnailUrl"
              type="url"
              className="w-full rounded-md border px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400"
              placeholder="https://..."
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-700">
              Thumbnail image (optional)
            </label>
            <input
              name="thumbnailFile"
              type="file"
              accept="image/*"
              className="block w-full text-xs text-slate-700"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-700">
              Intro video URL (optional)
            </label>
            <input
              name="introVideoUrl"
              type="url"
              className="w-full rounded-md border px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400"
              placeholder="https://..."
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-700">
              Intro video file (required)
            </label>
            <input
              name="introVideoFile"
              type="file"
              accept="video/*"
              className="block w-full text-xs text-slate-700"
              required
            />
          </div>
          <div className="md:col-span-2 flex items-center gap-2 pt-1">
            <input
              id="isCertificateCourse"
              name="isCertificateCourse"
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 text-slate-900"
            />
            <label htmlFor="isCertificateCourse" className="text-xs font-medium text-slate-700">
              This is a certificate course (learners can apply for a certificate after completion)
            </label>
          </div>
          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800"
              disabled={createCourseMutation.isPending}
            >
              {createCourseMutation.isPending ? "Creating..." : "Create course"}
            </button>
          </div>
        </form>
      </section>

      {isLoading && <div className="text-sm text-slate-500">Loading courses...</div>}

      {!isLoading && courses && courses.length > 0 && (
        <div className="overflow-hidden rounded-md border bg-white">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-slate-600">Title</th>
                <th className="px-4 py-2 text-left font-medium text-slate-600">Price</th>
                <th className="px-4 py-2 text-left font-medium text-slate-600">Views</th>
                <th className="px-4 py-2 text-left font-medium text-slate-600">Earnings</th>
                <th className="px-4 py-2 text-left font-medium text-slate-600">Status</th>
                <th className="px-4 py-2 text-right font-medium text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {courses.map((course) => (
                <tr key={course._id}>
                  <td className="px-4 py-2 text-slate-900">{course.title}</td>
                  <td className="px-4 py-2 text-slate-700">
                    {course.price && course.price > 0 ? `₹${course.price}` : "Free"}
                  </td>
                  <td className="px-4 py-2 text-slate-700">
                    {course.viewsTotal ?? 0}
                  </td>
                  <td className="px-4 py-2 text-slate-700">
                    {course.partnerEarnings != null ? `₹${course.partnerEarnings}` : "—"}
                  </td>
                  <td className="px-4 py-2 text-slate-700">
                    {course.published ? "Published" : "Draft"}
                  </td>
                  <td className="px-4 py-2 text-right space-y-1">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        className="inline-flex items-center rounded-md border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                        onClick={() =>
                          setExpandedCourseId((prev) => (prev === course._id ? null : course._id))
                        }
                      >
                        {expandedCourseId === course._id ? "Hide videos" : "Quick add videos"}
                      </button>
                      <Link
                        href={`/partner/courses/${course._id}`}
                        className="inline-flex items-center rounded-md border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                      >
                        Full editor
                      </Link>
                    </div>
                    {expandedCourseId === course._id && (
                      <div className="mt-2 space-y-2 rounded-md bg-slate-50 p-3 text-xs">
                        <div className="mb-1 font-semibold text-slate-800">Playlist videos</div>
                        {expandedPlaylist && expandedPlaylist.videos &&
                        expandedPlaylist.videos.length > 0 ? (
                          <ul className="space-y-1">
                            {expandedPlaylist.videos.map((video) => (
                              <li key={video._id} className="flex items-center justify-between">
                                <span className="truncate text-slate-800">
                                  {video.title}
                                </span>
                                {video.videoUrl && (
                                  <a
                                    href={video.videoUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="ml-2 text-[11px] text-slate-600 underline"
                                  >
                                    Open
                                  </a>
                                )}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div className="text-[11px] text-slate-500">
                            No videos yet. Add one below.
                          </div>
                        )}
                        <form
                          className="mt-2 space-y-1"
                          onSubmit={(e) => {
                            e.preventDefault();
                            const form = new FormData(e.currentTarget);
                            const title = String(form.get("videoTitle") || "").trim();
                            const videoUrl = String(form.get("videoUrl") || "").trim();
                            if (!title || !videoUrl) return;
                            addInlineVideoMutation.mutate({
                              courseId: course._id,
                              title,
                              videoUrl,
                            });
                            e.currentTarget.reset();
                          }}
                        >
                          <div className="space-y-1">
                            <label className="block text-[11px] font-medium text-slate-700">
                              Video title
                            </label>
                            <input
                              name="videoTitle"
                              type="text"
                              className="w-full rounded-md border px-2 py-1 text-xs text-slate-900 placeholder:text-slate-400"
                              placeholder="e.g. Lesson 1"
                              required
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="block text-[11px] font-medium text-slate-700">
                              Video URL
                            </label>
                            <input
                              name="videoUrl"
                              type="url"
                              className="w-full rounded-md border px-2 py-1 text-xs text-slate-900 placeholder:text-slate-400"
                              placeholder="https://..."
                              required
                            />
                          </div>
                          <div className="flex justify-end pt-1">
                            <button
                              type="submit"
                              disabled={addInlineVideoMutation.isPending}
                              className="inline-flex items-center rounded-md bg-slate-900 px-2 py-1 text-[11px] font-medium text-white hover:bg-slate-800"
                            >
                              {addInlineVideoMutation.isPending ? "Adding..." : "Add video"}
                            </button>
                          </div>
                        </form>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
