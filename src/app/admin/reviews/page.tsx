"use client";

import { useState, useEffect } from "react";
import Header from "@/app/_components/admin/Header";
import Button from "@/app/_components/admin/Button";
import Table from "@/app/_components/admin/Table";
import Badge from "@/app/_components/admin/Badge";
import Pagination from "@/app/_components/admin/Pagination";
import { reviewsAPI } from "../../../lib/api";
import { HiCheck, HiX, HiTrash, HiStar, HiReply, HiChatAlt } from "react-icons/hi";
import toast from "react-hot-toast";

interface Review {
  id: number;
  rating: number;
  comment: string | null;
  is_approved: boolean;
  admin_reply: string | null;
  admin_reply_at: string | null;
  user: { id: number; name: string };
  component: { id: number; title: string };
  created_at: string;
}

type FilterType = "all" | "pending" | "approved";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("all");
  const [meta, setMeta] = useState({
    current_page: 1,
    last_page: 1,
    pending_count: 0,
  });
  const [replyModal, setReplyModal] = useState<{
    isOpen: boolean;
    review: Review | null;
    replyText: string;
    submitting: boolean;
  }>({
    isOpen: false,
    review: null,
    replyText: "",
    submitting: false,
  });

  useEffect(() => {
    loadReviews();
  }, [meta.current_page, filter]);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const params: Record<string, unknown> = {
        page: meta.current_page,
        per_page: 10,
      };
      if (filter === "pending") params.is_approved = 0;
      if (filter === "approved") params.is_approved = 1;

      const response = await reviewsAPI.getAll(params);
      setReviews(response.data.data);
      setMeta({
        ...meta,
        last_page: response.data.meta.last_page,
        pending_count: response.data.meta.pending_count,
      });
    } catch (error) {
      toast.error("خطا در دریافت نظرات");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      await reviewsAPI.approve(id);
      toast.success("نظر تایید شد");
      loadReviews();
    } catch (error) {
      toast.error("خطا در تایید نظر");
    }
  };

  const handleReject = async (id: number) => {
    try {
      await reviewsAPI.reject(id);
      toast.success("نظر رد شد");
      loadReviews();
    } catch (error) {
      toast.error("خطا در رد نظر");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("آیا مطمئن هستید؟")) return;

    try {
      await reviewsAPI.delete(id);
      toast.success("نظر حذف شد");
      loadReviews();
    } catch (error) {
      toast.error("خطا در حذف نظر");
    }
  };

  const openReplyModal = (review: Review) => {
    setReplyModal({
      isOpen: true,
      review,
      replyText: review.admin_reply || "",
      submitting: false,
    });
  };

  const closeReplyModal = () => {
    setReplyModal({
      isOpen: false,
      review: null,
      replyText: "",
      submitting: false,
    });
  };

  const handleReplySubmit = async () => {
    if (!replyModal.review || !replyModal.replyText.trim()) {
      toast.error("لطفاً پاسخ را وارد کنید");
      return;
    }

    setReplyModal((prev) => ({ ...prev, submitting: true }));

    try {
      await reviewsAPI.reply(replyModal.review.id, replyModal.replyText.trim());
      toast.success("پاسخ ثبت شد");
      closeReplyModal();
      loadReviews();
    } catch (error) {
      toast.error("خطا در ثبت پاسخ");
      setReplyModal((prev) => ({ ...prev, submitting: false }));
    }
  };

  const handleDeleteReply = async (id: number) => {
    if (!window.confirm("آیا از حذف پاسخ مطمئن هستید؟")) return;

    try {
      await reviewsAPI.deleteReply(id);
      toast.success("پاسخ حذف شد");
      loadReviews();
    } catch (error) {
      toast.error("خطا در حذف پاسخ");
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <HiStar
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? "text-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const columns = [
    {
      header: "کاربر",
      render: (row: Review) => (
        <div>
          <p className="font-medium">{row.user?.name || "بدون نام"}</p>
        </div>
      ),
    },
    {
      header: "کامپوننت",
      render: (row: Review) => (
        <p className="text-sm">{row.component?.title}</p>
      ),
    },
    {
      header: "امتیاز",
      render: (row: Review) => renderStars(row.rating),
    },
    {
      header: "نظر",
      render: (row: Review) => (
        <div className="max-w-xs">
          <p className="text-sm text-gray-600 truncate">{row.comment || "-"}</p>
          {row.admin_reply && (
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
      render: (row: Review) => (
        <Badge variant={row.is_approved ? "success" : "warning"}>
          {row.is_approved ? "تایید شده" : "در انتظار"}
        </Badge>
      ),
    },
    {
      header: "عملیات",
      render: (row: Review) => (
        <div className="flex items-center gap-1">
          {!row.is_approved && (
            <button
              onClick={() => handleApprove(row.id)}
              className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
              title="تایید"
            >
              <HiCheck className="w-4 h-4" />
            </button>
          )}
          {row.is_approved && (
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
              row.admin_reply
                ? "text-blue-600 hover:bg-blue-50"
                : "text-gray-500 hover:bg-gray-50"
            }`}
            title={row.admin_reply ? "ویرایش پاسخ" : "پاسخ دادن"}
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
      <Header title="نظرات" />

      <div className="p-6">
        <div className="bg-white rounded-xl shadow-sm">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold">
              لیست نظرات
              {meta.pending_count > 0 && (
                <Badge variant="warning">
                  {meta.pending_count} در انتظار
                </Badge>
              )}
            </h3>

            <div className="flex items-center gap-2">
              <Button
                variant={filter === "all" ? "primary" : "secondary"}
                size="sm"
                onClick={() => {
                  setFilter("all");
                  setMeta({ ...meta, current_page: 1 });
                }}
              >
                همه
              </Button>
              <Button
                variant={filter === "pending" ? "primary" : "secondary"}
                size="sm"
                onClick={() => {
                  setFilter("pending");
                  setMeta({ ...meta, current_page: 1 });
                }}
              >
                در انتظار
              </Button>
              <Button
                variant={filter === "approved" ? "primary" : "secondary"}
                size="sm"
                onClick={() => {
                  setFilter("approved");
                  setMeta({ ...meta, current_page: 1 });
                }}
              >
                تایید شده
              </Button>
            </div>
          </div>

          <Table columns={columns} data={reviews} loading={loading} />

          <Pagination
            currentPage={meta.current_page}
            lastPage={meta.last_page}
            onPageChange={(page) => setMeta({ ...meta, current_page: page })}
          />
        </div>
      </div>

      {/* Reply Modal */}
      {replyModal.isOpen && replyModal.review && (
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
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium text-sm">
                    {replyModal.review.user?.name}
                  </span>
                  {renderStars(replyModal.review.rating)}
                </div>
                <p className="text-sm text-gray-600">{replyModal.review.comment}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  پاسخ شما
                </label>
                <textarea
                  value={replyModal.replyText}
                  onChange={(e) =>
                    setReplyModal((prev) => ({ ...prev, replyText: e.target.value }))
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
            </div>

            <div className="p-4 border-t flex items-center justify-between">
              <div>
                {replyModal.review.admin_reply && (
                  <button
                    onClick={() => {
                      handleDeleteReply(replyModal.review!.id);
                      closeReplyModal();
                    }}
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
                  disabled={replyModal.submitting || !replyModal.replyText.trim()}
                >
                  {replyModal.submitting ? "در حال ثبت..." : "ثبت پاسخ"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}