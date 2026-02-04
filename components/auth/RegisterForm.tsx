"use client";

import { Button, Input, Select } from "@/components/ui";
import { useState } from "react";

export function RegisterForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    companyName: "",
    companySize: "",
    jobTitle: "",
    industry: "",
    useCase: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // TODO: Implement API call
    console.log("Form data:", formData);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    alert("Đăng ký thành công! Chúng tôi sẽ liên hệ với bạn trong 24h.");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="rounded-2xl bg-white p-8 shadow-xl ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800 lg:p-10">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
          Đăng ký dùng thử miễn phí
        </h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Điền thông tin để bắt đầu. Chúng tôi sẽ liên hệ trong vòng 24 giờ.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Họ và tên"
          name="fullName"
          type="text"
          required
          placeholder="Nguyễn Văn A"
          value={formData.fullName}
          onChange={handleChange}
        />

        <Input
          label="Email công ty"
          name="email"
          type="email"
          required
          placeholder="nguyen.van.a@company.com"
          value={formData.email}
          onChange={handleChange}
          helperText="Vui lòng sử dụng email công ty"
        />

        <Input
          label="Số điện thoại"
          name="phone"
          type="tel"
          required
          placeholder="0912345678"
          value={formData.phone}
          onChange={handleChange}
        />

        <Input
          label="Tên công ty"
          name="companyName"
          type="text"
          required
          placeholder="Công ty TNHH ABC"
          value={formData.companyName}
          onChange={handleChange}
        />

        <Input
          label="Chức vụ"
          name="jobTitle"
          type="text"
          required
          placeholder="Giám đốc IT, HR Manager, CEO..."
          value={formData.jobTitle}
          onChange={handleChange}
        />

        <Select
          label="Quy mô công ty"
          name="companySize"
          required
          value={formData.companySize}
          onChange={handleChange}
        >
          <option value="">Chọn quy mô</option>
          <option value="1-50">1-50 nhân viên</option>
          <option value="51-200">51-200 nhân viên</option>
          <option value="201-500">201-500 nhân viên</option>
          <option value="501-1000">501-1000 nhân viên</option>
          <option value="1000+">Trên 1000 nhân viên</option>
        </Select>

        <Select
          label="Lĩnh vực hoạt động"
          name="industry"
          required
          value={formData.industry}
          onChange={handleChange}
        >
          <option value="">Chọn lĩnh vực</option>
          <option value="technology">Công nghệ thông tin</option>
          <option value="finance">Tài chính - Ngân hàng</option>
          <option value="retail">Bán lẻ - Thương mại</option>
          <option value="manufacturing">Sản xuất</option>
          <option value="healthcare">Y tế - Chăm sóc sức khỏe</option>
          <option value="education">Giáo dục</option>
          <option value="real-estate">Bất động sản</option>
          <option value="logistics">Logistics - Vận tải</option>
          <option value="other">Khác</option>
        </Select>

        <Select
          label="Mục đích sử dụng chính"
          name="useCase"
          required
          value={formData.useCase}
          onChange={handleChange}
        >
          <option value="">Chọn mục đích</option>
          <option value="internal-support">Hỗ trợ nhân viên nội bộ</option>
          <option value="knowledge-management">Quản lý kiến thức</option>
          <option value="customer-support">Hỗ trợ khách hàng</option>
          <option value="hr-onboarding">HR & Onboarding</option>
          <option value="sales-enablement">Hỗ trợ Sales</option>
          <option value="it-helpdesk">IT Helpdesk</option>
          <option value="other">Khác</option>
        </Select>

        <div className="flex items-start">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            required
            className="mt-1 h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-600"
          />
          <label htmlFor="terms" className="ml-3 text-sm text-zinc-600 dark:text-zinc-400">
            Tôi đồng ý với{" "}
            <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
              Điều khoản dịch vụ
            </a>{" "}
            và{" "}
            <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
              Chính sách bảo mật
            </a>
          </label>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Đang xử lý..." : "Đăng ký dùng thử miễn phí"}
        </Button>

        <p className="text-center text-xs text-zinc-500 dark:text-zinc-500">
          Đã có tài khoản?{" "}
          <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Đăng nhập
          </a>
        </p>
      </form>
    </div>
  );
}
