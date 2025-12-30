"use client";

import { useState, useEffect } from "react";
import Header from "@/app/_components/admin/Header";
import Button from "@/app/_components/admin/Button";
import Table from "@/app/_components/admin/Table";
import Badge from "@/app/_components/admin/Badge";
import Pagination from "@/app/_components/admin/Pagination";
import { reviewsAPI } from "../../../lib/api";
import { HiCheck, HiX, HiTrash, HiStar } from "react-icons/hi";
import toast from "react-hot-toast";

interface Review {
  id: number;
  rating: number;
  comment: string | null;
  is_approved: boolean;
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
        <p className="text-sm text-gray-600 max-w-xs truncate">
          {row.comment || "-"}
        </p>
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
                <Badge variant="warning" >
                  {meta.pending_count} در انتظار
                </Badge>
              )}
            </h3>

            {/* Filter Tabs */}
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
    </div>
  );
}