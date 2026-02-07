"use client";

import { useState, useEffect } from "react";
import Header from "@/app/_components/admin/Header";
import Table from "@/app/_components/admin/Table";
import Modal from "@/app/_components/admin/Modal";
import Badge from "@/app/_components/admin/Badge";
import Pagination from "@/app/_components/admin/Pagination";
import { contactAPI } from "../../../lib/api";
import { HiEye, HiTrash, HiMail, HiMailOpen } from "react-icons/hi";
import toast from "react-hot-toast";

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "unread" | "read" | "replied";
  created_at: string;
}

export default function ContactMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [meta, setMeta] = useState({ 
    current_page: 1, 
    last_page: 1, 
    total: 0 
  });

  // ✅ FIX: Use optional chaining and provide fallback
  useEffect(() => {
    loadMessages();
  }, [meta?.current_page, statusFilter]);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const params: any = {
        page: meta?.current_page || 1, // ✅ FIX: Fallback to 1
        per_page: 20,
      };
      
      if (statusFilter !== "all") {
        params.status = statusFilter;
      }

      const response = await contactAPI.getAll(params);
      
      setMessages(response.data.data || []); // ✅ FIX: Fallback to empty array
      
      // ✅ FIX: Only update meta if it exists
      if (response.data.meta) {
        setMeta(response.data.meta);
      }
    } catch (error: any) {
      console.error("Error loading messages:", error);
      toast.error(error.response?.data?.message || "خطا در دریافت پیام‌ها");
    } finally {
      setLoading(false);
    }
  };

  const openModal = async (message: ContactMessage) => {
    setSelectedMessage(message);
    setModalOpen(true);

    // Mark as read if unread
    if (message.status === "unread") {
      try {
        await contactAPI.updateStatus(message.id, "read");
        loadMessages();
      } catch (error) {
        console.error("Error marking as read:", error);
      }
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedMessage(null);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("آیا مطمئن هستید؟")) return;

    try {
      await contactAPI.delete(id);
      toast.success("پیام حذف شد");
      loadMessages();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "خطا در حذف");
    }
  };

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await contactAPI.updateStatus(id, status);
      toast.success("وضعیت تغییر کرد");
      loadMessages();
      if (selectedMessage?.id === id) {
        closeModal();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "خطا در تغییر وضعیت");
    }
  };

  const getSubjectLabel = (subject: string) => {
    const subjects: Record<string, string> = {
      support: "پشتیبانی",
      sales: "فروش",
      partnership: "همکاری",
      feedback: "پیشنهاد و انتقاد",
      other: "سایر",
    };
    return subjects[subject] || subject;
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "success" | "warning" | "danger" | "primary"> = {
      unread: "warning",
      read: "default",
      replied: "success",
    };
    const labels: Record<string, string> = {
      unread: "خوانده نشده",
      read: "خوانده شده",
      replied: "پاسخ داده شده",
    };
    return <Badge variant={variants[status]}>{labels[status]}</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const columns = [
    {
      header: "نام",
      render: (row: ContactMessage) => (
        <div>
          <p className="font-medium">{row.name}</p>
          <p className="text-xs text-gray-500" dir="ltr">
            {row.email}
          </p>
        </div>
      ),
    },
    {
      header: "موضوع",
      render: (row: ContactMessage) => (
        <span className="text-sm">{getSubjectLabel(row.subject)}</span>
      ),
    },
    {
      header: "پیام",
      render: (row: ContactMessage) => (
        <div className="max-w-xs">
          <p className="text-sm text-gray-600 truncate">{row.message}</p>
        </div>
      ),
    },
    {
      header: "تاریخ",
      render: (row: ContactMessage) => (
        <span className="text-sm text-gray-500">
          {formatDate(row.created_at)}
        </span>
      ),
    },
    {
      header: "وضعیت",
      render: (row: ContactMessage) => getStatusBadge(row.status),
    },
    {
      header: "عملیات",
      render: (row: ContactMessage) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => openModal(row)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
            title="مشاهده"
          >
            <HiEye className="w-4 h-4" />
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
      <Header title="پیام‌های تماس" />

      <div className="p-6">
        <div className="bg-white rounded-xl shadow-sm">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-4">
              <h3 className="font-semibold">لیست پیام‌ها</h3>
              <span className="text-sm text-gray-500">
                {meta?.total || 0} پیام
              </span>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setMeta({ ...meta, current_page: 1 }); // ✅ FIX: Reset to page 1
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">همه</option>
                <option value="unread">خوانده نشده</option>
                <option value="read">خوانده شده</option>
                <option value="replied">پاسخ داده شده</option>
              </select>
            </div>
          </div>

          <Table columns={columns} data={messages} loading={loading} />

          {meta && meta.last_page > 1 && ( // ✅ FIX: Only show if meta exists and has multiple pages
            <Pagination
              currentPage={meta.current_page}
              lastPage={meta.last_page}
              onPageChange={(page) => setMeta({ ...meta, current_page: page })}
            />
          )}
        </div>
      </div>

      {/* View Message Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title="جزئیات پیام"
      >
        {selectedMessage && (
          <div className="space-y-6">
            {/* Header Info */}
            <div className="grid grid-cols-2 gap-4 pb-4 border-b">
              <div>
                <p className="text-xs text-gray-500 mb-1">نام فرستنده</p>
                <p className="font-medium">{selectedMessage.name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">ایمیل</p>
                <p className="font-medium" dir="ltr">
                  {selectedMessage.email}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">موضوع</p>
                <p className="font-medium">
                  {getSubjectLabel(selectedMessage.subject)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">تاریخ</p>
                <p className="font-medium text-sm">
                  {formatDate(selectedMessage.created_at)}
                </p>
              </div>
            </div>

            {/* Message Content */}
            <div>
              <p className="text-xs text-gray-500 mb-2">متن پیام</p>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {selectedMessage.message}
                </p>
              </div>
            </div>

            {/* Status Badge */}
            <div>
              <p className="text-xs text-gray-500 mb-2">وضعیت</p>
              {getStatusBadge(selectedMessage.status)}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-4 border-t">
              {selectedMessage.status !== "replied" && (
                <button
                  onClick={() =>
                    handleStatusChange(selectedMessage.id, "replied")
                  }
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <HiMailOpen className="w-4 h-4" />
                  علامت به عنوان پاسخ داده شده
                </button>
              )}
              {selectedMessage.status === "replied" && (
                <button
                  onClick={() =>
                    handleStatusChange(selectedMessage.id, "read")
                  }
                  className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <HiMail className="w-4 h-4" />
                  علامت به عنوان خوانده شده
                </button>
              )}
              <button
                onClick={() => handleDelete(selectedMessage.id)}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <HiTrash className="w-4 h-4" />
                حذف پیام
              </button>
              <button
                onClick={closeModal}
                className="mr-auto px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                بستن
              </button>
            </div>

            {/* Reply to Email (Optional) */}
            <div className="pt-4 border-t">
              <a
                href={`mailto:${selectedMessage.email}?subject=پاسخ به: ${getSubjectLabel(selectedMessage.subject)}`}
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
              >
                <HiMail className="w-4 h-4" />
                پاسخ از طریق ایمیل
              </a>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}