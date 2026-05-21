"use client";

// app/admin/comments/page.tsx
import { useState, useEffect } from "react";
import Header from "@/app/_components/admin/Header";
import Button from "@/app/_components/admin/Button";
import Table from "@/app/_components/admin/Table";
import Badge from "@/app/_components/admin/Badge";
import Pagination from "@/app/_components/admin/Pagination";
import { adminCommentsAPI } from "@/lib/api";
import { HiCheck, HiX, HiTrash, HiReply, HiChatAlt } from "react-icons/hi";
import toast from "react-hot-toast";

interface Comment {
  id: number;
  body: string;
  status: "pending" | "approved" | "rejected";
  post: { id: number; title: string; slug: string };
  user: { id: number; name: string; mobile: string };
  has_reply: boolean;
  created_at: string;
}

interface CommentDetail extends Comment {
  reply: {
    id: number;
    body: string;
    created_at: string;
    user: { id: number; name: string };
  } | null;
}

type FilterType = "all" | "pending" | "approved" | "rejected";

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("all");
  const [meta, setMeta] = useState({
    current_page: 1,
    last_page: 1,
    pending_count: 0,
  });

  const [replyModal, setReplyModal] = useState<{
    isOpen: boolean;
    comment: CommentDetail | null;
    replyText: string;
    loading: boolean;
    saving: boolean;
  }>({
    isOpen: false,
    comment: null,
    replyText: "",
    loading: false,
    saving: false,
  });

  useEffect(() => {
    loadComments();
  }, [meta.current_page, filter]);

  const loadComments = async () => {
    setLoading(true);
    try {
      const params: Record<string, unknown> = {
        page: meta.current_page,
        per_page: 10,
      };
      if (filter !== "all") params.status = filter;

      const res = await adminCommentsAPI.getAll(params);
      setComments(res.data.data);
      setMeta((p) => ({
        ...p,
        last_page: res.data.meta.last_page,
        pending_count: res.data.meta.stats?.pending || 0,
      }));
    } catch {
      toast.error("خطا در دریافت نظرات");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      await adminCommentsAPI.approve(id);
      toast.success("نظر تایید شد");
      loadComments();
    } catch {
      toast.error("خطا در تایید نظر");
    }
  };

  const handleReject = async (id: number) => {
    try {
      await adminCommentsAPI.reject(id);
      toast.success("نظر رد شد");
      loadComments();
    } catch {
      toast.error("خطا در رد نظر");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("آیا مطمئن هستید؟")) return;
    try {
      await adminCommentsAPI.delete(id);
      toast.success("نظر حذف شد");
      loadComments();
    } catch {
      toast.error("خطا در حذف نظر");
    }
  };

  const openReplyModal = async (comment: Comment) => {
    setReplyModal({
      isOpen: true,
      comment: null,
      replyText: "",
      loading: true,
      saving: false,
    });
    try {
      const res = await adminCommentsAPI.getOne(comment.id);
      const detail: CommentDetail = res.data.data;
      setReplyModal((p) => ({
        ...p,
        comment: detail,
        replyText: detail.reply?.body || "",
        loading: false,
      }));
    } catch {
      toast.error("خطا در دریافت نظر");
      setReplyModal((p) => ({ ...p, loading: false, isOpen: false }));
    }
  };

  const closeReplyModal = () => {
    setReplyModal({
      isOpen: false,
      comment: null,
      replyText: "",
      loading: false,
      saving: false,
    });
  };

  const handleReplySubmit = async () => {
    if (!replyModal.comment || !replyModal.replyText.trim()) {
      toast.error("لطفاً پاسخ را وارد کنید");
      return;
    }
    setReplyModal((p) => ({ ...p, saving: true }));
    try {
      await adminCommentsAPI.reply(
        replyModal.comment.id,
        replyModal.replyText.trim(),
      );
      toast.success("پاسخ ثبت شد");
      closeReplyModal();
      loadComments();
    } catch {
      toast.error("خطا در ثبت پاسخ");
      setReplyModal((p) => ({ ...p, saving: false }));
    }
  };

  const handleDeleteReply = async (id: number) => {
    if (!window.confirm("آیا از حذف پاسخ مطمئن هستید؟")) return;
    try {
      await adminCommentsAPI.deleteReply(id);
      toast.success("پاسخ حذف شد");
      closeReplyModal();
      loadComments();
    } catch {
      toast.error("خطا در حذف پاسخ");
    }
  };

  const columns = [
    {
      header: "کاربر",
      render: (row: Comment) => (
        <div>
          <p className="font-medium text-sm">{row.user?.name}</p>
          <p className="text-xs text-gray-400 font-mono" dir="ltr">
            {row.user?.mobile}
          </p>
        </div>
      ),
    },
    {
      header: "مقاله",
      render: (row: Comment) => (
        <p className="text-sm text-gray-700 max-w-[160px] truncate">
          {row.post?.title}
        </p>
      ),
    },
    {
      header: "نظر",
      render: (row: Comment) => (
        <div className="max-w-xs">
          <p className="text-sm text-gray-600 line-clamp-2">{row.body}</p>
          {row.has_reply && (
            <div className="flex items-center gap-1 mt-1">
              <HiChatAlt className="w-3 h-3 text-blue-500" />
              <span className="text-xs text-blue-600">پاسخ داده شده</span>
            </div>
          )}
        </div>
      ),
    },
    {
      header: "وضعیت",
      render: (row: Comment) => (
        <Badge
          variant={
            row.status === "approved"
              ? "success"
              : row.status === "rejected"
                ? "danger"
                : "warning"
          }
        >
          {row.status === "approved"
            ? "تایید شده"
            : row.status === "rejected"
              ? "رد شده"
              : "در انتظار"}
        </Badge>
      ),
    },
    {
      header: "عملیات",
      render: (row: Comment) => (
        <div className="flex items-center gap-1">
          {row.status !== "approved" && (
            <button
              onClick={() => handleApprove(row.id)}
              className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
              title="تایید"
            >
              <HiCheck className="w-4 h-4" />
            </button>
          )}
          {row.status === "approved" && (
            <button
              onClick={() => handleReject(row.id)}
              className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg"
              title="رد"
            >
              <HiX className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => openReplyModal(row)}
            className={`p-2 rounded-lg ${
              row.has_reply
                ? "text-blue-600 hover:bg-blue-50"
                : "text-gray-500 hover:bg-gray-50"
            }`}
            title={row.has_reply ? "ویرایش پاسخ" : "پاسخ دادن"}
          >
            <HiReply className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
            title="حذف"
          >
            <HiTrash className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Header title="نظرات مقالات" />

      <div className="p-6">
        <div className="bg-white rounded-xl shadow-sm">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold flex items-center gap-2">
              لیست نظرات
              {meta.pending_count > 0 && (
                <Badge variant="warning">{meta.pending_count} در انتظار</Badge>
              )}
            </h3>
            <div className="flex items-center gap-2">
              {(["all", "pending", "approved", "rejected"] as FilterType[]).map(
                (f) => (
                  <Button
                    key={f}
                    variant={filter === f ? "primary" : "secondary"}
                    size="sm"
                    onClick={() => {
                      setFilter(f);
                      setMeta((p) => ({ ...p, current_page: 1 }));
                    }}
                  >
                    {f === "all"
                      ? "همه"
                      : f === "pending"
                        ? "در انتظار"
                        : f === "approved"
                          ? "تایید شده"
                          : "رد شده"}
                  </Button>
                ),
              )}
            </div>
          </div>

          <Table columns={columns} data={comments} loading={loading} />

          <Pagination
            currentPage={meta.current_page}
            lastPage={meta.last_page}
            onPageChange={(page) =>
              setMeta((p) => ({ ...p, current_page: page }))
            }
          />
        </div>
      </div>

      {/* Reply Modal */}
      {replyModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-semibold">پاسخ به نظر</h3>
              <button
                onClick={closeReplyModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <HiX className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {replyModal.loading ? (
                <div className="space-y-3">
                  <div className="h-20 bg-gray-100 rounded-lg animate-pulse" />
                  <div className="h-24 bg-gray-100 rounded-lg animate-pulse" />
                </div>
              ) : replyModal.comment ? (
                <>
                  {/* نظر اصلی */}
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-sm">
                        {replyModal.comment.user?.name}
                      </span>
                      <span className="text-xs text-gray-400">
                        {replyModal.comment.post?.title}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {replyModal.comment.body}
                    </p>
                  </div>

                  {/* فرم پاسخ */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {replyModal.comment.reply ? "ویرایش پاسخ" : "پاسخ شما"}
                    </label>
                    <textarea
                      value={replyModal.replyText}
                      onChange={(e) =>
                        setReplyModal((p) => ({
                          ...p,
                          replyText: e.target.value,
                        }))
                      }
                      placeholder="پاسخ خود را بنویسید..."
                      rows={4}
                      maxLength={1000}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    />
                    <p className="text-xs text-gray-400 mt-1 text-left">
                      {replyModal.replyText.length}/1000
                    </p>
                  </div>
                </>
              ) : null}
            </div>

            <div className="p-4 border-t flex items-center justify-between">
              <div>
                {replyModal.comment?.reply && (
                  <button
                    onClick={() => handleDeleteReply(replyModal.comment!.id)}
                    className="text-red-600 text-sm hover:underline"
                  >
                    حذف پاسخ
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button variant="secondary" onClick={closeReplyModal}>
                  انصراف
                </Button>
                <Button
                  variant="primary"
                  onClick={handleReplySubmit}
                  disabled={
                    replyModal.saving ||
                    replyModal.loading ||
                    !replyModal.replyText.trim()
                  }
                >
                  {replyModal.saving ? "در حال ثبت..." : "ثبت پاسخ"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
