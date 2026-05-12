export type TrustLogo = {
  id: string;
  name: string;
  logoSrc: string; // /public/trust/*.png
  note: string;
};

export type Certification = {
  id: string;
  title: string;
  logoSrc: string; // /public/trust/*.png or /public/certs/*.png
  description: string;
  certificateImageSrc?: string; // /public/certs/*.jpg
};

export type VideoItem = {
  id: string;
  title: string;
  type: "youtube" | "mp4";
  src: string; // youtube url or /public/videos/*.mp4
  thumbnailSrc: string; // /public/video-thumbs/*.png
  duration: string; // e.g. 0:45
};

export const trustLogos: TrustLogo[] = [
  { id: "iso", name: "ISO (placeholder)", logoSrc: "/trust/iso.png", note: "Tiêu chuẩn quản lý chất lượng (placeholder)." },
  { id: "eco", name: "Eco Label (placeholder)", logoSrc: "/trust/eco.png", note: "Vật liệu thân thiện môi trường (placeholder)." },
  { id: "lab", name: "Lab Tested (placeholder)", logoSrc: "/trust/lab.png", note: "Kiểm nghiệm theo lô (placeholder)." },
  { id: "partner-1", name: "Đối tác 1", logoSrc: "/trust/partner-01.png", note: "Đối tác phân phối (placeholder)." },
  { id: "partner-2", name: "Đối tác 2", logoSrc: "/trust/partner-02.png", note: "Hệ thống bán lẻ (placeholder)." },
  { id: "shipping", name: "Vận chuyển", logoSrc: "/trust/shipping.png", note: "Giao nhanh (placeholder)." }
];

export const certifications: Certification[] = [
  {
    id: "cert-1",
    title: "Chứng nhận an toàn (placeholder)",
    logoSrc: "/trust/lab.png",
    description: "Tập trung vào trải nghiệm sử dụng an tâm trong gia đình (placeholder).",
    certificateImageSrc: "/certs/cert-01.jpg"
  },
  {
    id: "cert-2",
    title: "Nguồn gốc rõ ràng (placeholder)",
    logoSrc: "/trust/iso.png",
    description: "Thông tin minh bạch, quy trình kiểm soát chất lượng (placeholder).",
    certificateImageSrc: "/certs/cert-02.jpg"
  },
  {
    id: "cert-3",
    title: "Đối tác phân phối (placeholder)",
    logoSrc: "/trust/partner-01.png",
    description: "Hợp tác phân phối để đảm bảo trải nghiệm mua sắm ổn định (placeholder)."
  }
];

export const videos: VideoItem[] = [
  {
    id: "v1",
    title: "Túi ENSO cũng cần tắm nắng",
    type: "youtube",
    src: "https://www.youtube.com/watch?v=OUeOGCeoPIQ",
    thumbnailSrc: "/video-thumbs/video-1.png",
    duration: "0:45"
  },
  {
    id: "v2",
    title: "Hướng dẫn đặt ENSO đúng vị trí (placeholder)",
    type: "mp4",
    src: "/videos/demo-01.mp4",
    thumbnailSrc: "/video-thumbs/video-2.png",
    duration: "1:12"
  },
  {
    id: "v3",
    title: "Case xe hơi: trước / sau (placeholder)",
    type: "youtube",
    src: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnailSrc: "/video-thumbs/video-3.png",
    duration: "0:58"
  }
];


