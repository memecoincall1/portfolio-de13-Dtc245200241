import dienBienPhuCover from '@/assets/books/dien-bien-phu-diem-hen-lich-su.jpg';
import nhanGianDangGiaCover from '@/assets/books/nhan-gian-dang-gia.jpg';
import tienDauVoiVangCover from '@/assets/books/tien-dau-voi-vang.jpg';
import tuDuyMoCover from '@/assets/books/tu-duy-mo.jpg';
import tuDuyNguocCover from '@/assets/books/tu-duy-nguoc.jpg';

export interface BookItem {
  id: string;
  title: string;
  author: string;
  reading: boolean; // Only true for "Tư Duy Ngược" and "Tư Duy Mở"
  category: string;
  year?: string;
  description: string;
  cover?: string; // Real cover image: bundled src/assets import or /public/covers path
  coverAccent: {
    bg: string;
    text: string;
    accent: string;
    motif: 'classic' | 'modern' | 'minimal' | 'bold';
  };
}

export interface ProjectItem {
  id: string;
  title: string;
  badge: string;
  concept: string;
  targetAudience: string;
  role: string;
  tech: string[];
  links?: { label: string; href: string }[];
  learnings: string[];
  needsInput?: string; // Fields marked for Hoan Duong to supply if desired
}

export interface ArticleItem {
  id: string;
  title: string;
  category: string;
  preview: string;
  date: string;
  readTime: string;
  isSample: boolean;
  body: Array<{
    tag: 'p' | 'h3' | 'em' | 'blockquote' | 'ul';
    text?: string;
    items?: string[];
  }>;
}

export const hoanProfile = {
  name: 'Hoan Duong',
  role: 'Learning & Building',
  university: 'ICTU — Trường Đại học Công nghệ Thông tin và Truyền thông, Đại học Thái Nguyên',
  location: 'Thái Nguyên, Việt Nam',
  interests: [
    'Công nghệ',
    'Phát triển website',
    'Internet culture',
    'Cộng đồng trực tuyến',
    'Thử nghiệm cá nhân',
  ],
  motto: 'Still figuring things out.',
  secondaryMottos: [
    'Learning by building.',
    'A work in progress.',
    'Exploring the internet, one idea at a time.',
  ],
  intro: {
    en: "I'm Hoan Duong, a technology student at ICTU in Thai Nguyen, Vietnam. I build things on the internet, experiment with ideas, and learn along the way.",
    vi: 'Mình là Hoan Duong, sinh viên công nghệ tại ICTU, Thái Nguyên, Việt Nam. Mình thích xây dựng những thứ trên internet, thử nghiệm các ý tưởng và học hỏi qua từng trải nghiệm.',
  },
  social: {
    linkedin: 'https://www.linkedin.com/in/hoanduongg',
    x: 'https://x.com/0xQuzazzz',
    email: 'hoanvuonxoai@gmail.com',
  },
};

/**
 * About page — interactive notes / accordion content.
 * Browser-safe editorial copy (no server runtime required).
 * Xưng hô đồng nhất "mình" trong toàn bộ nội dung.
 */
export interface AboutNoteItem {
  id: string;
  no: string;
  headerTitle: string;
  subHeading: string;
  body: string;
  tag: string;
}

export const aboutNotes: AboutNoteItem[] = [
  {
    id: 'nen-tang',
    no: '01',
    headerTitle: 'nền tảng',
    subHeading: 'công nghệ, web3 và sự tăng trưởng.',
    body: 'Mình hiện là sinh viên năm 3 chuyên ngành Công nghệ thông tin tại Trường Đại học Công nghệ Thông tin và Truyền thông Thái Nguyên (ICTU). Giữa rất nhiều hướng đi trong ngành, điều luôn kích thích sự tò mò của mình là điểm giao giữa lập trình, hệ thống phi tập trung (web3) và cách các cộng đồng trực tuyến vận hành trên Internet.',
    tag: 'ghi chú / 01',
  },
  {
    id: 'trai-nghiem',
    no: '02',
    headerTitle: 'trải nghiệm',
    subHeading: 'từ những dòng code đến vốn mạo hiểm.',
    body: 'Mảng công nghệ và tài chính mang lại cho mình cơ hội thử nghiệm thực tế từ rất sớm. Mình từng đảm nhận vị trí CMO tại một số quỹ đầu tư mạo hiểm (VC) công nghệ tại Việt Nam, đồng thời xây dựng và phát triển một cộng đồng hơn 1.000 thành viên. Tinh thần chủ đạo của mình vẫn luôn là Learning by building — học hỏi từ chính quá trình tạo ra sản phẩm.',
    tag: 'ghi chú / 02',
  },
  {
    id: 'tiep-theo',
    no: '03',
    headerTitle: 'điều gì sẽ xảy ra tiếp theo?',
    subHeading: 'vẫn đang mong chờ.',
    body: 'Mình cũng tham gia đầu tư và hỗ trợ rót vốn mạo hiểm cho các ý tưởng công nghệ ở giai đoạn sơ khai. Nếu bạn đang xây dựng điều gì đó thú vị, hãy kết nối với mình nhé.',
    tag: 'ghi chú / 03',
  },
];

export const booksList: BookItem[] = [
  {
    id: 'nha-gia-kim',
    title: 'Nhà giả kim',
    author: 'Paulo Coelho',
    reading: false,
    category: 'Văn học triết lý',
    year: '1988',
    description: 'Hành trình theo đuổi vận mệnh cá nhân của chàng chăn cừu Santiago, bài học về sự dũng cảm lắng nghe trái tim.',
    cover: '/covers/nha-gia-kim-isbn.jpg',
    coverAccent: {
      bg: '#c9933e',
      text: '#1f1b14',
      accent: '#faf3e0',
      motif: 'classic',
    },
  },
  {
    id: 'cha-giau-cha-ngheo',
    title: 'Cha giàu cha nghèo',
    author: 'Robert Kiyosaki',
    reading: false,
    category: 'Tài chính cá nhân',
    year: '1997',
    description: 'Góc nhìn cơ bản về tư duy tài chính, tài sản và tiêu sản, tạo nền tảng cho sự độc lập trong kinh tế cá nhân.',
    cover: '/covers/rich-dad-isbn.jpg',
    coverAccent: {
      bg: '#4c1d95',
      text: '#fdf4ff',
      accent: '#fbbf24',
      motif: 'bold',
    },
  },
  {
    id: 'tien-dau-voi-vang',
    title: 'Tiền đấu với vàng',
    author: 'James Richards',
    reading: false,
    category: 'Kinh tế & Lịch sử tiền tệ',
    year: '2013',
    description: 'Khảo cứu về lịch sử đấu tranh giữa các hệ thống tiền tệ, bản vị vàng và đồng tiền pháp định trong lịch sử thế giới.',
    cover: tienDauVoiVangCover,
    coverAccent: {
      bg: '#854d0e',
      text: '#fefce8',
      accent: '#facc15',
      motif: 'classic',
    },
  },
  {
    id: 'ban-khong',
    title: 'Bán khống',
    author: 'Michael Lewis',
    reading: false,
    category: 'Kinh tế tài chính',
    year: '2010',
    description: 'Câu chuyện kịch tính về cuộc khủng hoảng tài chính 2007-2008 qua góc nhìn của những kẻ dám đặt cược ngược lại thị trường.',
    cover: '/covers/big-short-isbn.jpg',
    coverAccent: {
      bg: '#0f172a',
      text: '#f8fafc',
      accent: '#ef4444',
      motif: 'bold',
    },
  },
  {
    id: 'thep-da-toi-the-day',
    title: 'Thép Đã Tôi Thế Đấy',
    author: 'Nikolai Ostrovsky',
    reading: false,
    category: 'Văn học kinh điển',
    year: '1936',
    description: 'Biểu tượng của nghị lực sống, ý chí kiên định và tinh thần cống hiến vượt qua mọi thử thách khắc nghiệt.',
    cover: '/covers/thep-da-toi-the-day.jpg',
    coverAccent: {
      bg: '#991b1b',
      text: '#fef2f2',
      accent: '#fbbf24',
      motif: 'classic',
    },
  },
  {
    id: 'dien-bien-phu-diem-hen-lich-su',
    title: 'Điện Biên Phủ - Điểm Hẹn Lịch Sử',
    author: 'Đại tướng Võ Nguyên Giáp (Hữu Mai thể hiện)',
    reading: false,
    category: 'Lịch sử quân sự',
    year: '2001',
    description: 'Hồi ký tái hiện lại toàn bộ diễn biến, quyết định chiến lược và diễn biến lịch sử chấn động địa cầu của chiến dịch Điện Biên Phủ năm 1954.',
    cover: dienBienPhuCover,
    coverAccent: {
      bg: '#14532d',
      text: '#f0fdf4',
      accent: '#eab308',
      motif: 'classic',
    },
  },
  {
    id: 'tu-duy-nguoc',
    title: 'Tư Duy Ngược',
    author: 'Nguyễn Anh Dũng',
    reading: true, // ĐANG ĐỌC
    category: 'Phát triển bản thân',
    year: '2021',
    description: 'Cuốn sách khuyến khích vượt qua những định kiến rập khuôn, nhìn nhận vấn đề từ nhiều góc độ trái chiều để khai phá lối đi riêng.',
    cover: tuDuyNguocCover,
    coverAccent: {
      bg: '#1e242b',
      text: '#f3f4f6',
      accent: '#a3e635', // Acid green
      motif: 'bold',
    },
  },
  {
    id: 'tren-dinh-pho-wall',
    title: 'Trên Đỉnh Phố Wall',
    author: 'Peter Lynch',
    reading: false,
    category: 'Đầu tư & Thị trường',
    year: '1989',
    description: 'Kinh nghiệm đầu tư thực tế từ một trong những nhà quản lý quỹ huyền thoại nhất, nhấn mạnh vào việc quan sát thực tế xung quanh.',
    cover: '/covers/one-up-isbn.jpg',
    coverAccent: {
      bg: '#1e3a5f',
      text: '#f8fafc',
      accent: '#34d399',
      motif: 'modern',
    },
  },
  {
    id: 'nhan-gian-dang-gia',
    title: 'Nhân Gian Đáng Giá',
    author: 'Tsuneko Nakamura & Hiromi Okuda',
    reading: false,
    category: 'Tản văn & Đời sống',
    year: '2019',
    description: 'Những suy nghĩ tinh tế, điềm tĩnh về cuộc sống, sự tự chủ và cách giữ gìn sự bình thản trước biến động thường nhật.',
    cover: nhanGianDangGiaCover,
    coverAccent: {
      bg: '#78350f',
      text: '#fffbeb',
      accent: '#fde68a',
      motif: 'minimal',
    },
  },
  {
    id: 'tu-duy-mo',
    title: 'Tư Duy Mở',
    author: 'Nguyễn Anh Dũng',
    reading: true, // ĐANG ĐỌC
    category: 'Tư duy & Kỹ năng',
    year: '2022',
    description: 'Bàn về việc giữ cho tâm trí luôn cởi mở trước những góc nhìn mới mẻ và sự biến chuyển không ngừng của thế giới xung quanh.',
    cover: tuDuyMoCover,
    coverAccent: {
      bg: '#252d3a',
      text: '#f9fafb',
      accent: '#38bdf8',
      motif: 'modern',
    },
  },
];

export const projectsList: ProjectItem[] = [
  {
    id: 'onchain-fund-flow-tracker',
    title: 'Ethereum Fund Flow Explorer',
    badge: 'Launching soon',
    concept: 'Hệ thống trực quan hóa đồ thị giao dịch và truy vết dòng tài sản trên mạng lưới Ethereum.',
    targetAudience: 'Thử nghiệm xây dựng giao diện tương tác đồ thị (Graph Visualization) giúp theo dõi luồng tài sản di chuyển qua các tầng ví (Seed wallet, CEX/DEX, Smart Contract) theo thời gian thực. Hệ thống hỗ trợ phát hiện sớm các cụm ví rủi ro cao và mô hình hóa đường đi của dòng tiền.',
    role: 'Thiết kế hệ thống trực quan hóa đồ thị dòng tiền (Fund Flow Graph) & Truy vết trên Ethereum.',
    tech: ['Ethereum', 'Ethers.js', 'Graph Analytics', 'React', 'TypeScript', 'Tailwind CSS'],
    learnings: [
      'Thử nghiệm thuật toán duyệt đồ thị (Graph Traversal) để xử lý hàng nghìn giao dịch mà không gây quá tải giao diện.',
      'Tối ưu trải nghiệm thị giác giúp người dùng dễ dàng nhận biết các cụm ví rủi ro (high-risk pulse) chỉ trong vài giây.',
    ],
  },
];

export const articlesList: ArticleItem[] = [
  {
    id: 'learning-by-building',
    title: 'Học Lập Trình Qua Việc Trực Tiếp Xây Dựng Sản Phẩm',
    category: 'Lập trình & Kỹ thuật',
    preview: 'Tại sao việc tự tay tạo ra một trang web dù nhỏ vẫn mang lại nhiều bài học sâu sắc hơn hàng giờ đọc tài liệu lý thuyết.',
    date: '10/2026',
    readTime: '4 phút',
    isSample: true,
    body: [
      {
        tag: 'p',
        text: 'Khi bắt đầu học công nghệ thông tin tại ICTU Thái Nguyên, mình từng nghĩ phải đọc hết mọi giáo trình và hiểu trọn vẹn lý thuyết trước khi bắt tay vào làm một thứ gì đó. Nhưng thực tế đã chứng minh điều ngược lại.',
      },
      {
        tag: 'h3',
        text: 'Cú va chạm đầu tiên với thực tế',
      },
      {
        tag: 'p',
        text: 'Chỉ khi tự mình mở editor, cấu hình router, xử lý lỗi layout trên màn hình điện thoại hay vật lộn với build error, kiến thức mới thực sự trở thành của mình. Mỗi lỗi gặp phải không còn là trở ngại mà là một bậc thang giúp mình hiểu sâu hơn về cách trình duyệt và mã nguồn hoạt động.',
      },
      {
        tag: 'blockquote',
        text: '“Xây dựng không phải là đích đến cuối cùng, mà là phương thức học hỏi chân thực nhất.”',
      },
      {
        tag: 'p',
        text: 'Website cá nhân này cũng là một phần của hành trình đó — một không gian để lưu lại những gì mình đang mày mò và quan sát.',
      },
    ],
  },
  {
    id: 'memecoin-and-internet-culture',
    title: 'Ghi Chép Khi Làm Website Cho Các Cộng Đồng Memecoin',
    category: 'Thử nghiệm Web',
    preview: 'Những quan sát thú vị về tốc độ lan truyền, tâm lý cộng đồng trực tuyến và vai trò của giao diện trong văn hóa Internet.',
    date: '09/2026',
    readTime: '5 phút',
    isSample: true,
    body: [
      {
        tag: 'p',
        text: 'Việc tham gia xây dựng một vài website memecoin cho các nhóm cộng đồng trực tuyến đã cho mình một góc nhìn rất khác về thế giới mạng. Đó là một môi trường chuyển động với tốc độ tính bằng giờ.',
      },
      {
        tag: 'h3',
        text: 'Giao diện và tính lan truyền',
      },
      {
        tag: 'p',
        text: 'Trong không gian đó, một website không chỉ là nơi cung cấp thông tin. Nó là điểm tựa thị giác của cả một cộng đồng. Thiết kế phải phản ánh được năng lượng của người tham gia, phải tải nhanh tức thì trên mobile khi có link chia sẻ trên Telegram hoặc X.',
      },
      {
        tag: 'p',
        text: 'Dù đây là những dự án thử nghiệm nhỏ, chúng đã giúp mình rèn luyện sự nhạy bén với trải nghiệm người dùng thực tế và hiểu hơn về cách các trào lưu Internet vận hành.',
      },
    ],
  },
  {
    id: 'still-figuring-things-out',
    title: 'Still Figuring Things Out: Không Cần Mọi Câu Trả Lời Ngay Lúc Này',
    category: 'Suy ngẫm & Hành trình',
    preview: 'Suy nghĩ cá nhân của một sinh viên công nghệ đang trên con đường khám phá hướng đi riêng tại Thái Nguyên.',
    date: '08/2026',
    readTime: '3 phút',
    isSample: true,
    body: [
      {
        tag: 'p',
        text: 'Nhiều người trẻ cảm thấy áp lực phải xác định ngay lập tức một danh xưng lớn lao hay một lộ trình hoàn hảo từ ngày đầu bước vào giảng đường. Nhưng mình chọn chấp nhận trạng thái "still figuring things out".',
      },
      {
        tag: 'h3',
        text: 'Giữ lại sự tò mò',
      },
      {
        tag: 'p',
        text: 'Chưa biết chính xác đích đến không có nghĩa là đứng yên. Mình tiếp tục viết code, đọc sách, theo dõi các xu hướng công nghệ mới và tự hỏi: "Điều này có thể phát triển thành sản phẩm hữu ích gì?". Hành trình này chính là mục đích.',
      },
    ],
  },
  {
    id: 'mobile-first-details',
    title: 'Tối Ưu Mobile-First: Những Chi Tiết Nhỏ Tạo Nên Khác Biệt',
    category: 'Lập trình & Kỹ thuật',
    preview: 'Tại sao việc chăm chút cho từng pixel trên màn hình 375px lại quan trọng hơn cả những animation hào nhoáng trên desktop.',
    date: '07/2026',
    readTime: '4 phút',
    isSample: true,
    body: [
      {
        tag: 'p',
        text: 'Khi kiểm tra analytics của các trang web mình từng làm, con số truy cập từ điện thoại thông minh luôn áp đảo. Điều đó buộc mình phải thay đổi hoàn toàn tư duy thiết kế: mọi bố cục đều phải sinh ra từ màn hình nhỏ trước.',
      },
      {
        tag: 'p',
        text: 'Từ kích thước vùng bấm (touch target tối thiểu 44px), khoảng cách giữa các khối, độ tương phản của chữ dưới ánh sáng ngoài trời đến khả năng vuốt chạm mượt mà — đây là những điều quyết định một website có "sống" được trên tay người dùng hay không.',
      },
    ],
  },
];
