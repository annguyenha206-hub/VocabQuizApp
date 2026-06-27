(function () {
  const root = document.getElementById("root");
  const STORAGE_KEY = "french_vocabulary_quizzer_items_v1";
  const QUIZ_STORAGE_KEY = "french_vocabulary_quizzer_saved_quizzes_v1";
  const PERF_KEY = "french_vocabulary_quizzer_performance_v1";
  const SEPARATORS = ["->", "→", "\t", "=", ":", "*", "|", ",", " - ", " -", "- "];
  const QUIZ_SIZES = [5, 10, 20, 50];
  const SHARE_PREFIX = "vocab=";
  const QUIZ_SHARE_PREFIX = "quiz=";
  const TTS_LANG_KEY = "french_vocabulary_quizzer_tts_lang_v1";
  const SOUND_SRC = "./assets/correct-wrong.mp3";

  function bi(id, term, definition) { return { id, term, definition }; }
  const BUILTIN_QUIZZES = [
    {
      id: "builtin-basic",
      name: "📢 Giao tiếp cơ bản",
      builtin: true,
      items: [
        bi("bc001","hello","xin chào"),
        bi("bc002","goodbye","tạm biệt"),
        bi("bc003","thank you","cảm ơn"),
        bi("bc004","you're welcome","không có gì"),
        bi("bc005","please","làm ơn"),
        bi("bc006","sorry","xin lỗi"),
        bi("bc007","excuse me","xin lỗi / cho hỏi"),
        bi("bc008","yes","có / vâng"),
        bi("bc009","no","không"),
        bi("bc010","I don't understand","tôi không hiểu"),
        bi("bc011","can you repeat that?","bạn có thể nhắc lại không?"),
        bi("bc012","do you speak English?","bạn có nói tiếng Anh không?"),
        bi("bc013","my name is...","tên tôi là..."),
        bi("bc014","nice to meet you","rất vui được gặp bạn"),
        bi("bc015","how are you?","bạn có khỏe không?"),
        bi("bc016","I'm fine","tôi khỏe"),
        bi("bc017","good morning","chào buổi sáng"),
        bi("bc018","good afternoon","chào buổi chiều"),
        bi("bc019","good evening","chào buổi tối"),
        bi("bc020","good night","chúc ngủ ngon"),
        bi("bc021","see you later","hẹn gặp lại"),
        bi("bc022","happy birthday","chúc mừng sinh nhật"),
        bi("bc023","congratulations","xin chúc mừng"),
        bi("bc024","take care","bảo trọng nhé"),
        bi("bc025","what time is it?","mấy giờ rồi?"),
        bi("bc026","where is...?","... ở đâu?"),
        bi("bc027","how much?","bao nhiêu tiền?"),
        bi("bc028","help!","cứu tôi / giúp với!"),
        bi("bc029","I need help","tôi cần giúp đỡ"),
        bi("bc030","I don't know","tôi không biết"),
        bi("bc031","speak slowly, please","xin hãy nói chậm thôi"),
        bi("bc032","can you help me?","bạn có thể giúp tôi không?"),
        bi("bc033","one","một"),
        bi("bc034","two","hai"),
        bi("bc035","three","ba"),
        bi("bc036","four","bốn"),
        bi("bc037","five","năm"),
        bi("bc038","six","sáu"),
        bi("bc039","seven","bảy"),
        bi("bc040","eight","tám"),
        bi("bc041","nine","chín"),
        bi("bc042","ten","mười"),
        bi("bc043","eleven","mười một"),
        bi("bc044","twelve","mười hai"),
        bi("bc045","thirteen","mười ba"),
        bi("bc046","fourteen","mười bốn"),
        bi("bc047","fifteen","mười lăm"),
        bi("bc048","sixteen","mười sáu"),
        bi("bc049","seventeen","mười bảy"),
        bi("bc050","eighteen","mười tám"),
        bi("bc051","nineteen","mười chín"),
        bi("bc052","twenty","hai mươi"),
        bi("bc053","thirty","ba mươi"),
        bi("bc054","forty","bốn mươi"),
        bi("bc055","fifty","năm mươi"),
        bi("bc056","hundred","một trăm"),
        bi("bc057","thousand","một nghìn"),
        bi("bc058","million","một triệu"),
        bi("bc059","first","thứ nhất"),
        bi("bc060","second","thứ hai"),
        bi("bc061","third","thứ ba"),
        bi("bc062","Monday","thứ Hai"),
        bi("bc063","Tuesday","thứ Ba"),
        bi("bc064","Wednesday","thứ Tư"),
        bi("bc065","Thursday","thứ Năm"),
        bi("bc066","Friday","thứ Sáu"),
        bi("bc067","Saturday","thứ Bảy"),
        bi("bc068","Sunday","Chủ Nhật"),
        bi("bc069","January","tháng Một"),
        bi("bc070","February","tháng Hai"),
        bi("bc071","March","tháng Ba"),
        bi("bc072","April","tháng Tư"),
        bi("bc073","May","tháng Năm"),
        bi("bc074","June","tháng Sáu"),
        bi("bc075","July","tháng Bảy"),
        bi("bc076","August","tháng Tám"),
        bi("bc077","September","tháng Chín"),
        bi("bc078","October","tháng Mười"),
        bi("bc079","November","tháng Mười Một"),
        bi("bc080","December","tháng Mười Hai"),
        bi("bc081","spring","mùa xuân"),
        bi("bc082","summer","mùa hè"),
        bi("bc083","autumn","mùa thu"),
        bi("bc084","winter","mùa đông"),
        bi("bc085","today","hôm nay"),
        bi("bc086","tomorrow","ngày mai"),
        bi("bc087","yesterday","hôm qua"),
        bi("bc088","now","bây giờ"),
        bi("bc089","later","sau này"),
        bi("bc090","soon","sắp thôi"),
        bi("bc091","always","luôn luôn"),
        bi("bc092","never","không bao giờ"),
        bi("bc093","sometimes","đôi khi"),
        bi("bc094","often","thường xuyên"),
        bi("bc095","already","rồi / đã rồi"),
        bi("bc096","yet","chưa"),
        bi("bc097","before","trước"),
        bi("bc098","after","sau"),
        bi("bc099","early","sớm"),
        bi("bc100","late","muộn / trễ"),
        bi("bc101","morning","buổi sáng"),
        bi("bc102","afternoon","buổi chiều"),
        bi("bc103","evening","buổi tối"),
        bi("bc104","night","ban đêm"),
        bi("bc105","week","tuần"),
        bi("bc106","month","tháng"),
        bi("bc107","year","năm"),
        bi("bc108","hour","giờ"),
        bi("bc109","minute","phút"),
        bi("bc110","sunny","trời nắng"),
        bi("bc111","rainy","trời mưa"),
        bi("bc112","cloudy","trời nhiều mây"),
        bi("bc113","windy","trời có gió"),
        bi("bc114","hot","nóng"),
        bi("bc115","cold","lạnh"),
        bi("bc116","warm","ấm"),
        bi("bc117","cool","mát"),
        bi("bc118","foggy","có sương mù"),
        bi("bc119","stormy","có bão"),
        bi("bc120","snow","tuyết"),
        bi("bc121","rainbow","cầu vồng"),
        bi("bc122","mother","mẹ"),
        bi("bc123","father","bố / cha"),
        bi("bc124","sister","chị / em gái"),
        bi("bc125","brother","anh / em trai"),
        bi("bc126","grandmother","bà"),
        bi("bc127","grandfather","ông"),
        bi("bc128","husband","chồng"),
        bi("bc129","wife","vợ"),
        bi("bc130","son","con trai"),
        bi("bc131","daughter","con gái"),
        bi("bc132","friend","bạn bè"),
        bi("bc133","baby","em bé"),
        bi("bc134","child","đứa trẻ"),
        bi("bc135","adult","người lớn"),
        bi("bc136","relative","họ hàng"),
        bi("bc137","uncle","chú / cậu / bác"),
        bi("bc138","aunt","cô / dì / bác gái"),
        bi("bc139","cousin","anh chị em họ"),
        bi("bc140","eat","ăn"),
        bi("bc141","drink","uống"),
        bi("bc142","sleep","ngủ"),
        bi("bc143","wake up","thức dậy"),
        bi("bc144","walk","đi bộ"),
        bi("bc145","run","chạy"),
        bi("bc146","sit","ngồi"),
        bi("bc147","stand","đứng"),
        bi("bc148","open","mở"),
        bi("bc149","close","đóng"),
        bi("bc150","buy","mua"),
        bi("bc151","sell","bán"),
        bi("bc152","pay","trả tiền"),
        bi("bc153","wait","đợi / chờ"),
        bi("bc154","come","đến / lại"),
        bi("bc155","go","đi"),
        bi("bc156","speak","nói"),
        bi("bc157","listen","nghe"),
        bi("bc158","read","đọc"),
        bi("bc159","write","viết"),
        bi("bc160","call","gọi điện"),
        bi("bc161","cook","nấu ăn"),
        bi("bc162","clean","dọn dẹp"),
        bi("bc163","work","làm việc"),
        bi("bc164","study","học"),
        bi("bc165","play","chơi"),
        bi("bc166","watch","xem"),
        bi("bc167","drive","lái xe"),
        bi("bc168","swim","bơi"),
        bi("bc169","give","đưa / cho"),
        bi("bc170","take","lấy / cầm"),
        bi("bc171","make","làm / tạo"),
        bi("bc172","like","thích"),
        bi("bc173","love","yêu / yêu thích"),
        bi("bc174","hate","ghét"),
        bi("bc175","want","muốn"),
        bi("bc176","need","cần"),
        bi("bc177","know","biết"),
        bi("bc178","think","nghĩ"),
        bi("bc179","feel","cảm thấy"),
        bi("bc180","see","nhìn / thấy"),
        bi("bc181","hear","nghe thấy"),
        bi("bc182","big","to / lớn"),
        bi("bc183","small","nhỏ"),
        bi("bc184","tall","cao"),
        bi("bc185","short","thấp / ngắn"),
        bi("bc186","young","trẻ"),
        bi("bc187","old","già / cũ"),
        bi("bc188","beautiful","đẹp"),
        bi("bc189","good","tốt"),
        bi("bc190","bad","xấu / tệ"),
        bi("bc191","fast","nhanh"),
        bi("bc192","slow","chậm"),
        bi("bc193","clean","sạch"),
        bi("bc194","dirty","bẩn"),
        bi("bc195","cheap","rẻ"),
        bi("bc196","expensive","đắt"),
        bi("bc197","near","gần"),
        bi("bc198","far","xa"),
        bi("bc199","new","mới"),
        bi("bc200","heavy","nặng")
      ]
    },
    {
      id: "builtin-work",
      name: "💼 Công việc & văn phòng",
      builtin: true,
      items: [
        bi("wk001","meeting","cuộc họp"),
        bi("wk002","deadline","hạn chót"),
        bi("wk003","report (n)","báo cáo"),
        bi("wk004","presentation","bài thuyết trình"),
        bi("wk005","email","thư điện tử"),
        bi("wk006","manager","quản lý"),
        bi("wk007","colleague","đồng nghiệp"),
        bi("wk008","schedule (n)","lịch trình"),
        bi("wk009","project","dự án"),
        bi("wk010","budget","ngân sách"),
        bi("wk011","negotiation","đàm phán"),
        bi("wk012","contract","hợp đồng"),
        bi("wk013","invoice","hóa đơn"),
        bi("wk014","overtime","làm thêm giờ"),
        bi("wk015","promotion","thăng chức"),
        bi("wk016","salary","lương"),
        bi("wk017","resign (v)","từ chức"),
        bi("wk018","interview","phỏng vấn"),
        bi("wk019","resume (n)","hồ sơ xin việc / CV"),
        bi("wk020","feedback","phản hồi"),
        bi("wk021","agenda","chương trình họp"),
        bi("wk022","minutes (n)","biên bản cuộc họp"),
        bi("wk023","conference","hội nghị"),
        bi("wk024","department","phòng ban"),
        bi("wk025","employee","nhân viên"),
        bi("wk026","employer","người sử dụng lao động"),
        bi("wk027","client","khách hàng"),
        bi("wk028","profit","lợi nhuận"),
        bi("wk029","headquarters","trụ sở chính"),
        bi("wk030","approve (v)","phê duyệt"),
        bi("wk031","postpone (v)","trì hoãn / dời lại"),
        bi("wk032","workload","khối lượng công việc"),
        bi("wk033","CEO","Giám đốc điều hành"),
        bi("wk034","director","giám đốc"),
        bi("wk035","supervisor","người giám sát"),
        bi("wk036","team leader","trưởng nhóm"),
        bi("wk037","intern","thực tập sinh"),
        bi("wk038","accountant","kế toán viên"),
        bi("wk039","engineer","kỹ sư"),
        bi("wk040","designer","nhà thiết kế"),
        bi("wk041","developer","lập trình viên"),
        bi("wk042","analyst","nhà phân tích"),
        bi("wk043","consultant","tư vấn viên"),
        bi("wk044","receptionist","lễ tân"),
        bi("wk045","secretary","thư ký"),
        bi("wk046","HR manager","quản lý nhân sự"),
        bi("wk047","sales representative","đại diện kinh doanh"),
        bi("wk048","marketing manager","quản lý marketing"),
        bi("wk049","lawyer","luật sư"),
        bi("wk050","project manager","quản lý dự án"),
        bi("wk051","stakeholder","các bên liên quan"),
        bi("wk052","shareholder","cổ đông"),
        bi("wk053","computer","máy tính"),
        bi("wk054","laptop","máy tính xách tay"),
        bi("wk055","monitor","màn hình"),
        bi("wk056","keyboard","bàn phím"),
        bi("wk057","mouse","chuột máy tính"),
        bi("wk058","printer","máy in"),
        bi("wk059","scanner","máy quét"),
        bi("wk060","projector","máy chiếu"),
        bi("wk061","whiteboard","bảng trắng"),
        bi("wk062","desk","bàn làm việc"),
        bi("wk063","chair","ghế"),
        bi("wk064","filing cabinet","tủ đựng hồ sơ"),
        bi("wk065","stapler","dập ghim"),
        bi("wk066","folder","bìa hồ sơ"),
        bi("wk067","notebook","sổ tay"),
        bi("wk068","pen","bút"),
        bi("wk069","highlighter","bút đánh dấu"),
        bi("wk070","calendar","lịch"),
        bi("wk071","telephone","điện thoại"),
        bi("wk072","photocopier","máy photocopy"),
        bi("wk073","brainstorm","động não / lên ý tưởng"),
        bi("wk074","draft (v)","soạn thảo"),
        bi("wk075","revise","chỉnh sửa"),
        bi("wk076","submit","nộp"),
        bi("wk077","review (v)","xem xét / đánh giá"),
        bi("wk078","reject","từ chối"),
        bi("wk079","delegate","ủy quyền / giao việc"),
        bi("wk080","coordinate","phối hợp"),
        bi("wk081","collaborate","cộng tác"),
        bi("wk082","implement","thực hiện / triển khai"),
        bi("wk083","evaluate","đánh giá"),
        bi("wk084","monitor (v)","theo dõi"),
        bi("wk085","track","theo dõi / giám sát"),
        bi("wk086","prioritize","ưu tiên"),
        bi("wk087","multitask","làm nhiều việc cùng lúc"),
        bi("wk088","proofread","đọc soát lỗi"),
        bi("wk089","launch","ra mắt / khởi động"),
        bi("wk090","scale","mở rộng quy mô"),
        bi("wk091","outsource","thuê ngoài"),
        bi("wk092","automate","tự động hóa"),
        bi("wk093","hire","tuyển dụng"),
        bi("wk094","fire (v)","sa thải"),
        bi("wk095","onboard","hướng dẫn nhân viên mới"),
        bi("wk096","train (v)","đào tạo"),
        bi("wk097","performance review","đánh giá hiệu suất"),
        bi("wk098","bonus","tiền thưởng"),
        bi("wk099","benefits","phúc lợi"),
        bi("wk100","sick leave","nghỉ ốm"),
        bi("wk101","annual leave","nghỉ phép năm"),
        bi("wk102","maternity leave","nghỉ thai sản"),
        bi("wk103","remote work","làm việc từ xa"),
        bi("wk104","hybrid work","làm việc kết hợp"),
        bi("wk105","full-time","toàn thời gian"),
        bi("wk106","part-time","bán thời gian"),
        bi("wk107","freelance","làm tự do"),
        bi("wk108","internship","thực tập"),
        bi("wk109","probation period","thời gian thử việc"),
        bi("wk110","notice period","thời gian thông báo nghỉ việc"),
        bi("wk111","job description","mô tả công việc"),
        bi("wk112","reference","thư giới thiệu"),
        bi("wk113","revenue","doanh thu"),
        bi("wk114","cost","chi phí"),
        bi("wk115","expense","khoản chi"),
        bi("wk116","loss","thua lỗ"),
        bi("wk117","investment","đầu tư"),
        bi("wk118","strategy","chiến lược"),
        bi("wk119","competitor","đối thủ cạnh tranh"),
        bi("wk120","market share","thị phần"),
        bi("wk121","target","mục tiêu"),
        bi("wk122","KPI","chỉ số hiệu suất chính"),
        bi("wk123","ROI","lợi tức đầu tư"),
        bi("wk124","cash flow","dòng tiền"),
        bi("wk125","asset","tài sản"),
        bi("wk126","liability","nợ phải trả"),
        bi("wk127","tax","thuế"),
        bi("wk128","discount","giảm giá"),
        bi("wk129","commission","hoa hồng"),
        bi("wk130","quotation","báo giá"),
        bi("wk131","proposal","đề xuất"),
        bi("wk132","tender","đấu thầu"),
        bi("wk133","follow up","theo dõi tiếp / hỏi thăm lại"),
        bi("wk134","cc (carbon copy)","gửi bản sao"),
        bi("wk135","attachment","tệp đính kèm"),
        bi("wk136","forward","chuyển tiếp"),
        bi("wk137","reply all","trả lời tất cả"),
        bi("wk138","urgent","khẩn cấp"),
        bi("wk139","ASAP","càng sớm càng tốt"),
        bi("wk140","FYI","để bạn biết"),
        bi("wk141","action item","việc cần làm"),
        bi("wk142","summary","tóm tắt"),
        bi("wk143","update (n)","thông tin cập nhật"),
        bi("wk144","clarify","làm rõ"),
        bi("wk145","confirm","xác nhận"),
        bi("wk146","acknowledge","xác nhận đã nhận"),
        bi("wk147","reschedule","đổi lịch"),
        bi("wk148","escalate","leo thang / báo lên cấp trên"),
        bi("wk149","loop in","thêm vào vòng thông tin"),
        bi("wk150","sign off","phê duyệt / chấp thuận"),
        bi("wk151","software","phần mềm"),
        bi("wk152","hardware","phần cứng"),
        bi("wk153","database","cơ sở dữ liệu"),
        bi("wk154","server","máy chủ"),
        bi("wk155","cloud","điện toán đám mây"),
        bi("wk156","backup","sao lưu"),
        bi("wk157","update (v)","cập nhật"),
        bi("wk158","install","cài đặt"),
        bi("wk159","crash","sự cố hệ thống"),
        bi("wk160","bug","lỗi phần mềm"),
        bi("wk161","troubleshoot","khắc phục sự cố"),
        bi("wk162","IT support","bộ phận hỗ trợ kỹ thuật"),
        bi("wk163","password","mật khẩu"),
        bi("wk164","login","đăng nhập"),
        bi("wk165","network","mạng"),
        bi("wk166","VPN","mạng riêng ảo"),
        bi("wk167","cybersecurity","an ninh mạng"),
        bi("wk168","data breach","rò rỉ dữ liệu"),
        bi("wk169","encryption","mã hóa"),
        bi("wk170","two-factor authentication","xác thực hai yếu tố"),
        bi("wk171","I'll get back to you","tôi sẽ phản hồi lại bạn"),
        bi("wk172","let's touch base","hãy liên lạc với nhau"),
        bi("wk173","please find attached","vui lòng xem tệp đính kèm"),
        bi("wk174","as per our discussion","như đã thảo luận"),
        bi("wk175","keep me posted","hãy cập nhật cho tôi"),
        bi("wk176","move forward","tiến lên / tiến hành"),
        bi("wk177","on track","đúng tiến độ"),
        bi("wk178","behind schedule","trễ tiến độ"),
        bi("wk179","wrap up","kết thúc / tổng kết"),
        bi("wk180","task","nhiệm vụ / công việc"),
        bi("wk181","deadline extension","gia hạn thời gian"),
        bi("wk182","org chart","sơ đồ tổ chức"),
        bi("wk183","workflow","quy trình làm việc"),
        bi("wk184","meeting room","phòng họp"),
        bi("wk185","conference call","cuộc gọi hội nghị"),
        bi("wk186","agenda item","mục trong chương trình họp"),
        bi("wk187","team building","xây dựng tinh thần đội nhóm"),
        bi("wk188","annual report","báo cáo thường niên"),
        bi("wk189","quarterly review","đánh giá hàng quý"),
        bi("wk190","business trip","chuyến công tác"),
        bi("wk191","expense report","báo cáo chi phí"),
        bi("wk192","reimbursement","hoàn trả chi phí"),
        bi("wk193","signed contract","hợp đồng đã ký"),
        bi("wk194","approval","sự phê duyệt"),
        bi("wk195","cc'd","đã được sao chép trong email"),
        bi("wk196","attached file","tệp đính kèm"),
        bi("wk197","business card","danh thiếp"),
        bi("wk198","company policy","chính sách công ty"),
        bi("wk199","office supplies","văn phòng phẩm"),
        bi("wk200","meeting notes","ghi chú cuộc họp")
      ]
    },
    {
      id: "builtin-travel",
      name: "✈️ Du lịch",
      builtin: true,
      items: [
        bi("tv001","passport","hộ chiếu"),
        bi("tv002","airport","sân bay"),
        bi("tv003","hotel","khách sạn"),
        bi("tv004","ticket","vé"),
        bi("tv005","boarding pass","thẻ lên máy bay"),
        bi("tv006","luggage","hành lý"),
        bi("tv007","customs","hải quan"),
        bi("tv008","taxi","xe taxi"),
        bi("tv009","bus","xe buýt"),
        bi("tv010","train","tàu hỏa"),
        bi("tv011","subway","tàu điện ngầm"),
        bi("tv012","map","bản đồ"),
        bi("tv013","restaurant","nhà hàng"),
        bi("tv014","menu","thực đơn"),
        bi("tv015","bill (n)","hóa đơn"),
        bi("tv016","reservation","đặt phòng / đặt chỗ"),
        bi("tv017","check-in","làm thủ tục nhận phòng"),
        bi("tv018","check-out","trả phòng"),
        bi("tv019","sightseeing","tham quan"),
        bi("tv020","tour guide","hướng dẫn viên"),
        bi("tv021","flight","chuyến bay"),
        bi("tv022","delay (n)","sự chậm trễ / hoãn"),
        bi("tv023","currency","tiền tệ"),
        bi("tv024","exchange rate","tỷ giá hối đoái"),
        bi("tv025","accommodation","chỗ ở"),
        bi("tv026","destination","điểm đến"),
        bi("tv027","departure","khởi hành"),
        bi("tv028","arrival","đến nơi"),
        bi("tv029","visa","thị thực"),
        bi("tv030","tourist","khách du lịch"),
        bi("tv031","refund","hoàn tiền"),
        bi("tv032","lost and found","phòng đồ thất lạc"),
        bi("tv033","car","xe ô tô"),
        bi("tv034","motorbike","xe máy"),
        bi("tv035","bicycle","xe đạp"),
        bi("tv036","ferry","phà"),
        bi("tv037","cable car","cáp treo"),
        bi("tv038","tram","xe điện"),
        bi("tv039","rideshare","dịch vụ đi chung xe"),
        bi("tv040","rental car","xe thuê"),
        bi("tv041","highway","đường cao tốc"),
        bi("tv042","traffic jam","ùn tắc giao thông"),
        bi("tv043","gas station","trạm xăng"),
        bi("tv044","parking lot","bãi đỗ xe"),
        bi("tv045","toll","phí cầu đường"),
        bi("tv046","seatbelt","dây an toàn"),
        bi("tv047","driver","tài xế"),
        bi("tv048","passenger","hành khách"),
        bi("tv049","route","tuyến đường"),
        bi("tv050","one-way street","đường một chiều"),
        bi("tv051","pedestrian","người đi bộ"),
        bi("tv052","crosswalk","vạch qua đường"),
        bi("tv053","terminal","nhà ga / sảnh"),
        bi("tv054","gate","cổng"),
        bi("tv055","departure lounge","phòng chờ bay"),
        bi("tv056","baggage claim","khu nhận hành lý"),
        bi("tv057","check-in counter","quầy làm thủ tục"),
        bi("tv058","immigration","kiểm tra nhập cảnh"),
        bi("tv059","security checkpoint","trạm kiểm tra an ninh"),
        bi("tv060","carry-on","hành lý xách tay"),
        bi("tv061","overweight baggage","hành lý quá cân"),
        bi("tv062","transit","quá cảnh"),
        bi("tv063","layover","thời gian dừng chân"),
        bi("tv064","direct flight","chuyến bay thẳng"),
        bi("tv065","one-way ticket","vé một chiều"),
        bi("tv066","round trip","vé khứ hồi"),
        bi("tv067","economy class","hạng phổ thông"),
        bi("tv068","business class","hạng thương gia"),
        bi("tv069","window seat","ghế cạnh cửa sổ"),
        bi("tv070","aisle seat","ghế cạnh lối đi"),
        bi("tv071","boarding time","giờ lên máy bay"),
        bi("tv072","flight cancellation","hủy chuyến bay"),
        bi("tv073","hostel","nhà trọ"),
        bi("tv074","motel","khách sạn nhỏ ven đường"),
        bi("tv075","resort","khu nghỉ dưỡng"),
        bi("tv076","front desk","lễ tân"),
        bi("tv077","room service","dịch vụ phòng"),
        bi("tv078","breakfast included","bao gồm bữa sáng"),
        bi("tv079","single room","phòng đơn"),
        bi("tv080","double room","phòng đôi"),
        bi("tv081","suite","phòng hạng sang"),
        bi("tv082","housekeeping","dọn phòng"),
        bi("tv083","minibar","tủ đồ uống nhỏ trong phòng"),
        bi("tv084","wake-up call","gọi đánh thức"),
        bi("tv085","swimming pool","hồ bơi"),
        bi("tv086","gym","phòng tập thể dục"),
        bi("tv087","spa","trung tâm chăm sóc sức khỏe"),
        bi("tv088","elevator","thang máy"),
        bi("tv089","laundry","giặt ủi"),
        bi("tv090","key card","thẻ khóa phòng"),
        bi("tv091","do not disturb","không làm phiền"),
        bi("tv092","room number","số phòng"),
        bi("tv093","appetizer","món khai vị"),
        bi("tv094","main course","món chính"),
        bi("tv095","dessert","món tráng miệng"),
        bi("tv096","vegetarian","ăn chay"),
        bi("tv097","vegan","thuần chay"),
        bi("tv098","spicy","cay"),
        bi("tv099","mild","nhẹ / không cay"),
        bi("tv100","gluten-free","không chứa gluten"),
        bi("tv101","food allergy","dị ứng thực phẩm"),
        bi("tv102","tap water","nước máy"),
        bi("tv103","still water","nước lọc không có gas"),
        bi("tv104","sparkling water","nước có gas"),
        bi("tv105","tip","tiền tip / tiền thưởng"),
        bi("tv106","takeaway","mang đi"),
        bi("tv107","street food","thức ăn đường phố"),
        bi("tv108","local specialty","đặc sản địa phương"),
        bi("tv109","seafood","hải sản"),
        bi("tv110","brunch","bữa ăn sáng muộn"),
        bi("tv111","buffet","tiệc buffet"),
        bi("tv112","waiter","bồi bàn"),
        bi("tv113","order (v)","gọi món"),
        bi("tv114","portion","khẩu phần"),
        bi("tv115","souvenir","quà lưu niệm"),
        bi("tv116","discount","giảm giá"),
        bi("tv117","receipt","hóa đơn / biên lai"),
        bi("tv118","credit card","thẻ tín dụng"),
        bi("tv119","cash","tiền mặt"),
        bi("tv120","ATM","máy rút tiền tự động"),
        bi("tv121","duty-free shop","cửa hàng miễn thuế"),
        bi("tv122","fitting room","phòng thử đồ"),
        bi("tv123","exchange policy","chính sách đổi hàng"),
        bi("tv124","bargain","mặc cả"),
        bi("tv125","price tag","thẻ giá"),
        bi("tv126","shop assistant","nhân viên bán hàng"),
        bi("tv127","queue","xếp hàng"),
        bi("tv128","brand","thương hiệu"),
        bi("tv129","shopping mall","trung tâm thương mại"),
        bi("tv130","market","chợ"),
        bi("tv131","open","mở cửa"),
        bi("tv132","closed","đóng cửa"),
        bi("tv133","sold out","hết hàng"),
        bi("tv134","gift","quà tặng"),
        bi("tv135","turn left","rẽ trái"),
        bi("tv136","turn right","rẽ phải"),
        bi("tv137","go straight","đi thẳng"),
        bi("tv138","intersection","ngã tư"),
        bi("tv139","roundabout","vòng xuyến"),
        bi("tv140","bridge","cầu"),
        bi("tv141","tunnel","đường hầm"),
        bi("tv142","north","hướng bắc"),
        bi("tv143","south","hướng nam"),
        bi("tv144","east","hướng đông"),
        bi("tv145","west","hướng tây"),
        bi("tv146","nearby","gần đây"),
        bi("tv147","landmark","địa danh nổi tiếng"),
        bi("tv148","uphill","lên dốc"),
        bi("tv149","downhill","xuống dốc"),
        bi("tv150","corner","góc đường"),
        bi("tv151","in front of","phía trước"),
        bi("tv152","behind","phía sau"),
        bi("tv153","next to","bên cạnh"),
        bi("tv154","across from","đối diện"),
        bi("tv155","museum","bảo tàng"),
        bi("tv156","temple","đền / chùa"),
        bi("tv157","pagoda","chùa"),
        bi("tv158","palace","cung điện"),
        bi("tv159","national park","vườn quốc gia"),
        bi("tv160","beach","bãi biển"),
        bi("tv161","mountain","núi"),
        bi("tv162","waterfall","thác nước"),
        bi("tv163","castle","lâu đài"),
        bi("tv164","cathedral","nhà thờ lớn"),
        bi("tv165","viewpoint","điểm ngắm cảnh"),
        bi("tv166","entrance fee","phí vào cửa"),
        bi("tv167","opening hours","giờ mở cửa"),
        bi("tv168","audio guide","hướng dẫn bằng âm thanh"),
        bi("tv169","guided tour","tour có hướng dẫn viên"),
        bi("tv170","historical site","di tích lịch sử"),
        bi("tv171","art gallery","phòng trưng bày nghệ thuật"),
        bi("tv172","night market","chợ đêm"),
        bi("tv173","botanical garden","vườn thực vật"),
        bi("tv174","zoo","vườn thú"),
        bi("tv175","emergency","tình huống khẩn cấp"),
        bi("tv176","police station","đồn cảnh sát"),
        bi("tv177","ambulance","xe cứu thương"),
        bi("tv178","fire truck","xe cứu hỏa"),
        bi("tv179","hospital","bệnh viện"),
        bi("tv180","pharmacy","nhà thuốc"),
        bi("tv181","doctor","bác sĩ"),
        bi("tv182","injured","bị thương"),
        bi("tv183","stolen","bị mất cắp"),
        bi("tv184","travel insurance","bảo hiểm du lịch"),
        bi("tv185","embassy","đại sứ quán"),
        bi("tv186","consulate","lãnh sự quán"),
        bi("tv187","first aid","sơ cứu"),
        bi("tv188","emergency exit","lối thoát hiểm"),
        bi("tv189","lost passport","mất hộ chiếu"),
        bi("tv190","I'm lost","tôi bị lạc"),
        bi("tv191","where can I find","tôi có thể tìm ... ở đâu?"),
        bi("tv192","I have a reservation","tôi có đặt chỗ trước"),
        bi("tv193","do you have wifi","ở đây có wifi không?"),
        bi("tv194","the bill please","cho tôi hóa đơn"),
        bi("tv195","is service included","đã bao gồm phí dịch vụ chưa?"),
        bi("tv196","can I pay by card","tôi có thể thanh toán bằng thẻ không?"),
        bi("tv197","is this seat taken","chỗ này có ai ngồi chưa?"),
        bi("tv198","what do you recommend","bạn gợi ý gì cho tôi?"),
        bi("tv199","how do I get to","tôi đến ... bằng cách nào?"),
        bi("tv200","itinerary","lịch trình chuyến đi")
      ]
    },
    {
      id: "builtin-3000",
      name: "📚 3000 từ vựng cơ bản",
      builtin: true,
      items: [
        bi("vk001","ability","khả năng"),
        bi("vk002","absence","sự vắng mặt"),
        bi("vk003","accept (v)","chấp nhận"),
        bi("vk004","accident","tai nạn"),
        bi("vk005","account","tài khoản / tài khoản ngân hàng"),
        bi("vk006","achieve (v)","đạt được"),
        bi("vk007","action","hành động"),
        bi("vk008","actually","thực ra / thực sự"),
        bi("vk009","address (n)","địa chỉ"),
        bi("vk010","admire (v)","ngưỡng mộ"),
        bi("vk011","advantage","lợi thế"),
        bi("vk012","advice","lời khuyên"),
        bi("vk013","afraid (adj)","sợ hãi"),
        bi("vk014","agree (v)","đồng ý"),
        bi("vk015","allow (v)","cho phép"),
        bi("vk016","almost","hầu như / gần như"),
        bi("vk017","alone (adj)","một mình"),
        bi("vk018","although","mặc dù"),
        bi("vk019","amount","số lượng / số tiền"),
        bi("vk020","angry (adj)","tức giận"),
        bi("vk021","announce (v)","thông báo"),
        bi("vk022","anxiety","lo lắng / sự lo âu"),
        bi("vk023","apply (v)","nộp đơn / áp dụng"),
        bi("vk024","appreciate (v)","trân trọng / đánh giá cao"),
        bi("vk025","approach (v)","tiếp cận / đến gần"),
        bi("vk026","argue (v)","tranh luận / cãi nhau"),
        bi("vk027","arrange (v)","sắp xếp"),
        bi("vk028","avoid (v)","tránh"),
        bi("vk029","aware (adj)","nhận thức được / biết"),
        bi("vk030","background","nền tảng / bối cảnh"),
        bi("vk031","behavior","hành vi"),
        bi("vk032","believe (v)","tin tưởng / cho rằng"),
        bi("vk033","benefit (n)","lợi ích"),
        bi("vk034","borrow (v)","mượn"),
        bi("vk035","break (v)","vỡ / phá vỡ"),
        bi("vk036","bright (adj)","sáng / thông minh"),
        bi("vk037","build (v)","xây dựng"),
        bi("vk038","busy (adj)","bận rộn"),
        bi("vk039","calm (adj)","bình tĩnh"),
        bi("vk040","career","sự nghiệp"),
        bi("vk041","careful (adj)","cẩn thận"),
        bi("vk042","cause (n)","nguyên nhân"),
        bi("vk043","challenge (n)","thách thức"),
        bi("vk044","chance","cơ hội / khả năng"),
        bi("vk045","change (v)","thay đổi"),
        bi("vk046","choose (v)","chọn"),
        bi("vk047","clear (adj)","rõ ràng"),
        bi("vk048","collect (v)","thu thập / sưu tầm"),
        bi("vk049","comfortable (adj)","thoải mái"),
        bi("vk050","communicate (v)","giao tiếp"),
        bi("vk051","compare (v)","so sánh"),
        bi("vk052","complain (v)","phàn nàn"),
        bi("vk053","complete (v)","hoàn thành"),
        bi("vk054","confuse (v)","làm bối rối"),
        bi("vk055","connect (v)","kết nối"),
        bi("vk056","consider (v)","xem xét / cân nhắc"),
        bi("vk057","continue (v)","tiếp tục"),
        bi("vk058","control (v)","kiểm soát"),
        bi("vk059","convenient (adj)","tiện lợi"),
        bi("vk060","correct (adj)","đúng / chính xác"),
        bi("vk061","create (v)","tạo ra"),
        bi("vk062","creative (adj)","sáng tạo"),
        bi("vk063","culture","văn hóa"),
        bi("vk064","damage (v)","gây hại / làm hỏng"),
        bi("vk065","dangerous (adj)","nguy hiểm"),
        bi("vk066","deal with (v)","giải quyết / đối phó"),
        bi("vk067","decide (v)","quyết định"),
        bi("vk068","describe (v)","miêu tả"),
        bi("vk069","destroy (v)","phá hủy"),
        bi("vk070","develop (v)","phát triển"),
        bi("vk071","different (adj)","khác nhau"),
        bi("vk072","difficult (adj)","khó khăn"),
        bi("vk073","disappear (v)","biến mất"),
        bi("vk074","discover (v)","khám phá"),
        bi("vk075","discuss (v)","thảo luận"),
        bi("vk076","distance","khoảng cách"),
        bi("vk077","doubt (n)","sự nghi ngờ"),
        bi("vk078","dream (n)","giấc mơ / ước mơ"),
        bi("vk079","earn (v)","kiếm được"),
        bi("vk080","easy (adj)","dễ dàng"),
        bi("vk081","effect","hiệu quả / tác động"),
        bi("vk082","effort","nỗ lực / cố gắng"),
        bi("vk083","embarrassed (adj)","xấu hổ / bối rối"),
        bi("vk084","encourage (v)","khuyến khích"),
        bi("vk085","environment","môi trường"),
        bi("vk086","equipment","thiết bị / dụng cụ"),
        bi("vk087","especially","đặc biệt là"),
        bi("vk088","event","sự kiện"),
        bi("vk089","exact (adj)","chính xác"),
        bi("vk090","example","ví dụ"),
        bi("vk091","expect (v)","mong đợi / kỳ vọng"),
        bi("vk092","experience (n)","kinh nghiệm / trải nghiệm"),
        bi("vk093","explain (v)","giải thích"),
        bi("vk094","fail (v)","thất bại"),
        bi("vk095","familiar (adj)","quen thuộc"),
        bi("vk096","famous (adj)","nổi tiếng"),
        bi("vk097","finally","cuối cùng"),
        bi("vk098","find out (v)","tìm hiểu / phát hiện"),
        bi("vk099","focus (v)","tập trung"),
        bi("vk100","follow (v)","theo dõi / làm theo"),
        bi("vk101","forget (v)","quên"),
        bi("vk102","freedom","tự do"),
        bi("vk103","friendly (adj)","thân thiện"),
        bi("vk104","funny (adj)","buồn cười / hài hước"),
        bi("vk105","goal","mục tiêu"),
        bi("vk106","grateful (adj)","biết ơn"),
        bi("vk107","grow (v)","phát triển / lớn lên"),
        bi("vk108","guess (v)","đoán"),
        bi("vk109","habit","thói quen"),
        bi("vk110","happen (v)","xảy ra"),
        bi("vk111","health","sức khỏe"),
        bi("vk112","helpful (adj)","hữu ích"),
        bi("vk113","honest (adj)","thành thật / trung thực"),
        bi("vk114","however","tuy nhiên"),
        bi("vk115","huge (adj)","khổng lồ / rất lớn"),
        bi("vk116","imagine (v)","tưởng tượng"),
        bi("vk117","improve (v)","cải thiện"),
        bi("vk118","include (v)","bao gồm"),
        bi("vk119","increase (v)","tăng lên"),
        bi("vk120","information","thông tin"),
        bi("vk121","instead","thay vào đó"),
        bi("vk122","interest (n)","sự quan tâm / lãi suất"),
        bi("vk123","introduce (v)","giới thiệu"),
        bi("vk124","involve (v)","liên quan đến"),
        bi("vk125","issue","vấn đề"),
        bi("vk126","jealous (adj)","ghen tị / ghen tuông"),
        bi("vk127","journey","hành trình"),
        bi("vk128","keep (v)","giữ / tiếp tục"),
        bi("vk129","knowledge","kiến thức"),
        bi("vk130","lazy (adj)","lười biếng"),
        bi("vk131","lead (v)","dẫn dắt / lãnh đạo"),
        bi("vk132","learn (v)","học"),
        bi("vk133","lend (v)","cho mượn"),
        bi("vk134","lonely (adj)","cô đơn"),
        bi("vk135","lucky (adj)","may mắn"),
        bi("vk136","manage (v)","quản lý / xoay sở"),
        bi("vk137","matter (v)","quan trọng"),
        bi("vk138","mean (v)","có nghĩa là"),
        bi("vk139","mention (v)","đề cập"),
        bi("vk140","miss (v)","nhớ / bỏ lỡ"),
        bi("vk141","mistake","lỗi / sai lầm"),
        bi("vk142","natural (adj)","tự nhiên"),
        bi("vk143","necessary (adj)","cần thiết"),
        bi("vk144","nervous (adj)","lo lắng / hồi hộp"),
        bi("vk145","notice (v)","chú ý / nhận ra"),
        bi("vk146","offer (v)","đề nghị / cung cấp"),
        bi("vk147","opinion","ý kiến"),
        bi("vk148","opportunity","cơ hội"),
        bi("vk149","organize (v)","tổ chức / sắp xếp"),
        bi("vk150","overcome (v)","vượt qua"),
        bi("vk151","patient (adj)","kiên nhẫn"),
        bi("vk152","perform (v)","thực hiện / biểu diễn"),
        bi("vk153","prepare (v)","chuẩn bị"),
        bi("vk154","prevent (v)","ngăn chặn"),
        bi("vk155","probably","có lẽ / chắc là"),
        bi("vk156","problem","vấn đề / bài toán"),
        bi("vk157","progress (n)","tiến bộ / tiến độ"),
        bi("vk158","protect (v)","bảo vệ"),
        bi("vk159","provide (v)","cung cấp"),
        bi("vk160","purpose","mục đích"),
        bi("vk161","reach (v)","đạt tới / vươn tới"),
        bi("vk162","realize (v)","nhận ra / hiểu ra"),
        bi("vk163","reason","lý do"),
        bi("vk164","receive (v)","nhận được"),
        bi("vk165","recognize (v)","nhận ra / công nhận"),
        bi("vk166","recommend (v)","khuyến nghị / giới thiệu"),
        bi("vk167","reduce (v)","giảm"),
        bi("vk168","relationship","mối quan hệ"),
        bi("vk169","remember (v)","nhớ"),
        bi("vk170","repeat (v)","lặp lại"),
        bi("vk171","replace (v)","thay thế"),
        bi("vk172","require (v)","yêu cầu / cần"),
        bi("vk173","respect (v)","tôn trọng"),
        bi("vk174","result","kết quả"),
        bi("vk175","serious (adj)","nghiêm túc / nghiêm trọng"),
        bi("vk176","share (v)","chia sẻ"),
        bi("vk177","similar (adj)","tương tự / giống nhau"),
        bi("vk178","simple (adj)","đơn giản"),
        bi("vk179","situation","tình huống"),
        bi("vk180","skill","kỹ năng"),
        bi("vk181","solve (v)","giải quyết"),
        bi("vk182","spend (v)","tiêu / dành thời gian"),
        bi("vk183","strange (adj)","kỳ lạ / xa lạ"),
        bi("vk184","study (v)","học tập / nghiên cứu"),
        bi("vk185","succeed (v)","thành công"),
        bi("vk186","suggest (v)","gợi ý / đề xuất"),
        bi("vk187","support (v)","hỗ trợ / ủng hộ"),
        bi("vk188","surprise (n)","sự bất ngờ"),
        bi("vk189","therefore","vì vậy / do đó"),
        bi("vk190","tired (adj)","mệt mỏi"),
        bi("vk191","travel (v)","đi du lịch / di chuyển"),
        bi("vk192","trust (v)","tin tưởng"),
        bi("vk193","try (v)","cố gắng / thử"),
        bi("vk194","understand (v)","hiểu"),
        bi("vk195","upset (adj)","buồn / khó chịu"),
        bi("vk196","useful (adj)","hữu ích"),
        bi("vk197","various (adj)","khác nhau / đa dạng"),
        bi("vk198","waste (v)","lãng phí"),
        bi("vk199","wonder (v)","tự hỏi / thắc mắc"),
        bi("vk200","worry (v)","lo lắng")
      ]
    },
  ];

  let soundContext = null;
  let soundBuffer = null;
  let soundCues = null;
  let soundLoadPromise = null;
  const sharedVocabulary = loadSharedVocabulary();
  const sharedQuiz = loadSharedQuiz();

  const state = {
    vocabulary: sharedQuiz ? mergeVocabulary(loadVocabulary(), sharedQuiz.items) : sharedVocabulary || loadVocabulary(),
    savedQuizzes: sharedQuiz ? upsertSavedQuiz(loadSavedQuizzes(), sharedQuiz) : loadSavedQuizzes(),
    query: "",
    form: { term: "", definition: "" },
    editingId: null,
    inlineEditId: null,
    inlineEditTerm: "",
    inlineEditDef: "",
    bulkText: "",
    importSummary: null,
    shareLink: "",
    shareStatus: "",
    quizName: sharedQuiz ? sharedQuiz.name : "",
    savedQuizLink: "",
    savedQuizStatus: sharedQuiz ? `Đã tải bài kiểm tra: ${sharedQuiz.name}.` : "",
    quizSize: 10,
    customSize: "",
    quizDirection: "term-to-def",
    quizMode: "type",
    choiceOptions: [],
    ttsLang: localStorage.getItem(TTS_LANG_KEY) || "en-US",
    view: sharedQuiz ? "quiz" : "study",
    quizItems: sharedQuiz ? shuffle(sharedQuiz.items) : [],
    activeQuizName: sharedQuiz ? sharedQuiz.name : "",
    questionIndex: 0,
    answer: "",
    answers: [],
    feedback: null,
    sortMode: "incorrect-first",
  };

  if (sharedVocabulary) {
    saveVocabulary();
    state.shareStatus = `Đã tải ${state.vocabulary.length} từ được chia sẻ.`;
  }
  if (sharedQuiz) {
    saveVocabulary();
    saveSavedQuizzes();
  }

  preloadSound();

  function createId() {
    return crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
  }

  function migrateLegacyItem(item) {
    if (item && 'french' in item && !('term' in item)) {
      return { id: item.id || createId(), term: item.french || "", definition: item.vietnamese || "" };
    }
    return item;
  }

  function loadVocabulary() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw).map(migrateLegacyItem) : [];
    } catch {
      return [];
    }
  }

  function loadSavedQuizzes() {
    try {
      const raw = localStorage.getItem(QUIZ_STORAGE_KEY);
      return raw ? JSON.parse(raw).map(q => ({ ...q, items: (q.items || []).map(migrateLegacyItem) })) : [];
    } catch {
      return [];
    }
  }

  // ── Cloud sync ───────────────────────────────────────────
  const isLocal = ["localhost", "127.0.0.1", ""].includes(location.hostname);
  let _syncing = false;      // prevents push loop during pull
  let _syncTimer = null;

  function pushToCloud() {
    if (_syncing || isLocal) return;
    clearTimeout(_syncTimer);
    _syncTimer = setTimeout(async () => {
      const token = localStorage.getItem("VQ_SESSION_TOKEN");
      if (!token) return;
      try {
        await fetch("/api/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-session-token": token },
          body: JSON.stringify({ vocabulary: state.vocabulary, savedQuizzes: state.savedQuizzes }),
        });
      } catch {}
    }, 800);
  }

  async function syncFromCloud() {
    if (isLocal) return;
    const token = localStorage.getItem("VQ_SESSION_TOKEN");
    if (!token) return;
    try {
      const res = await fetch("/api/sync", { headers: { "x-session-token": token } });
      if (!res.ok) return;
      const { vocabulary, savedQuizzes } = await res.json();
      _syncing = true;
      if (Array.isArray(vocabulary) && vocabulary.length > 0) {
        state.vocabulary = vocabulary.map(migrateLegacyItem);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.vocabulary));
      }
      if (Array.isArray(savedQuizzes) && savedQuizzes.length > 0) {
        state.savedQuizzes = savedQuizzes;
        localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(state.savedQuizzes));
      }
      _syncing = false;
      render();
    } catch {
      _syncing = false;
    }
  }
  // ─────────────────────────────────────────────────────────

  function saveVocabulary() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.vocabulary));
    } catch {
      console.warn("Không thể lưu từ vựng: bộ nhớ có thể đã đầy.");
    }
    pushToCloud();
  }

  function saveSavedQuizzes() {
    try {
      localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(state.savedQuizzes));
    } catch {
      console.warn("Không thể lưu bài kiểm tra: bộ nhớ có thể đã đầy.");
    }
    pushToCloud();
  }

  function perfKey(item) {
    return `${item.term.toLowerCase().trim()}|${item.definition.toLowerCase().trim()}`;
  }

  function loadPerformance() {
    try {
      const raw = localStorage.getItem(PERF_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch { return {}; }
  }

  function savePerformance(perf) {
    try {
      localStorage.setItem(PERF_KEY, JSON.stringify(perf));
    } catch {}
  }

  function updatePerformance(answers) {
    const perf = loadPerformance();
    answers.forEach(({ item, correct, skipped }) => {
      if (skipped) return;
      const key = perfKey(item);
      const cur = perf[key] || { attempts: 0, correct: 0 };
      perf[key] = { attempts: cur.attempts + 1, correct: cur.correct + (correct ? 1 : 0) };
    });
    savePerformance(perf);
  }

  function weightedSelectItems(items, count) {
    const perf = loadPerformance();
    const weighted = items.map(item => {
      const data = perf[perfKey(item)];
      let weight;
      if (!data || data.attempts === 0) weight = 3;
      else {
        const acc = data.correct / data.attempts;
        weight = acc < 0.5 ? 4 : acc < 0.8 ? 2 : 1;
      }
      return { item, weight };
    });

    const selected = [];
    const pool = [...weighted];
    const target = Math.min(count, pool.length);

    while (selected.length < target && pool.length > 0) {
      const total = pool.reduce((s, w) => s + w.weight, 0);
      let rand = Math.random() * total;
      let idx = 0;
      while (idx < pool.length - 1 && (rand -= pool[idx].weight) > 0) idx++;
      selected.push(pool[idx].item);
      pool.splice(idx, 1);
    }
    return shuffle(selected);
  }

  function bytesToBase64(bytes) {
    let binary = "";
    for (let index = 0; index < bytes.length; index += 0x8000) {
      binary += String.fromCharCode(...bytes.subarray(index, index + 0x8000));
    }
    return btoa(binary);
  }

  function base64ToBytes(value) {
    const binary = atob(value);
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index);
    }
    return bytes;
  }

  function encodeSharePayload(items) {
    const payload = items.map(({ term, definition }) => ({ term, definition }));
    return bytesToBase64(new TextEncoder().encode(JSON.stringify(payload)));
  }

  function decodeSharePayload(value) {
    const json = new TextDecoder().decode(base64ToBytes(value));
    const parsed = JSON.parse(json);
    if (!Array.isArray(parsed)) return null;
    const items = parsed
      .map((item) => ({
        id: createId(),
        term: typeof item.term === "string" ? item.term.trim() : (typeof item.french === "string" ? item.french.trim() : ""),
        definition: typeof item.definition === "string" ? item.definition.trim() : (typeof item.vietnamese === "string" ? item.vietnamese.trim() : ""),
      }))
      .filter((item) => item.term && item.definition);
    return items.length ? items : null;
  }

  function normalizeSharedItems(items) {
    if (!Array.isArray(items)) return [];
    return items
      .map((item) => ({
        id: createId(),
        term: typeof item.term === "string" ? item.term.trim() : (typeof item.french === "string" ? item.french.trim() : ""),
        definition: typeof item.definition === "string" ? item.definition.trim() : (typeof item.vietnamese === "string" ? item.vietnamese.trim() : ""),
      }))
      .filter((item) => item.term && item.definition);
  }

  function encodeQuizPayload(quiz) {
    const payload = {
      name: quiz.name,
      items: quiz.items.map(({ term, definition }) => ({ term, definition })),
    };
    return bytesToBase64(new TextEncoder().encode(JSON.stringify(payload)));
  }

  function decodeQuizPayload(value) {
    const json = new TextDecoder().decode(base64ToBytes(value));
    const parsed = JSON.parse(json);
    const items = normalizeSharedItems(parsed && parsed.items);
    if (!items.length) return null;
    return {
      id: createId(),
      name: typeof parsed.name === "string" && parsed.name.trim() ? parsed.name.trim() : "Shared quiz",
      items,
      createdAt: new Date().toISOString(),
    };
  }

  function loadSharedVocabulary() {
    try {
      if (!window.location.hash.startsWith(`#${SHARE_PREFIX}`)) return null;
      const encoded = decodeURIComponent(window.location.hash.slice(SHARE_PREFIX.length + 1));
      return decodeSharePayload(encoded);
    } catch {
      return null;
    }
  }

  function loadSharedQuiz() {
    try {
      if (!window.location.hash.startsWith(`#${QUIZ_SHARE_PREFIX}`)) return null;
      const encoded = decodeURIComponent(window.location.hash.slice(QUIZ_SHARE_PREFIX.length + 1));
      return decodeQuizPayload(encoded);
    } catch {
      return null;
    }
  }

  function mergeVocabulary(currentItems, incomingItems) {
    const seen = new Set(currentItems.map((item) => `${item.term}\n${item.definition}`.toLowerCase()));
    const additions = incomingItems.filter((item) => {
      const key = `${item.term}\n${item.definition}`.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    return [...additions, ...currentItems];
  }

  function upsertSavedQuiz(quizzes, quiz) {
    const key = `${quiz.name}\n${quiz.items.map((item) => `${item.term}:${item.definition}`).join("|")}`.toLowerCase();
    const exists = quizzes.some((saved) => {
      const savedKey = `${saved.name}\n${saved.items.map((item) => `${item.term}:${item.definition}`).join("|")}`.toLowerCase();
      return savedKey === key;
    });
    return exists ? quizzes : [{ ...quiz, id: quiz.id || createId(), createdAt: quiz.createdAt || new Date().toISOString() }, ...quizzes];
  }

  async function shortenUrl(url) {
    if (url.startsWith("file://") || url.includes("localhost") || url.includes("127.0.0.1")) {
      return url;
    }
    try {
      const response = await fetch(`https://is.gd/create.php?format=simple&url=${encodeURIComponent(url)}`);
      if (!response.ok) throw new Error("failed");
      const short = (await response.text()).trim();
      return short.startsWith("http") ? short : url;
    } catch {
      return url;
    }
  }

  async function createShareLink() {
    if (state.vocabulary.length === 0) return;
    const encoded = encodeURIComponent(encodeSharePayload(state.vocabulary));
    const longUrl = `${window.location.href.split("#")[0]}#${SHARE_PREFIX}${encoded}`;
    state.shareLink = "";
    state.shareStatus = "Đang rút gọn link…";
    render();
    const short = await shortenUrl(longUrl);
    state.shareLink = short;
    state.shareStatus = short !== longUrl
      ? `Đã rút gọn link cho ${state.vocabulary.length} từ.`
      : `Đã tạo link cho ${state.vocabulary.length} từ.`;
    render();
  }

  async function copyShareLink() {
    if (!state.shareLink) return;
    try {
      await navigator.clipboard.writeText(state.shareLink);
      state.shareStatus = "Đã sao chép link.";
    } catch {
      state.shareStatus = "Không thể tự động sao chép. Hãy chọn link và sao chép thủ công.";
    }
    render();
  }

  function createQuizShareLink(quiz) {
    const encoded = encodeURIComponent(encodeQuizPayload(quiz));
    return `${window.location.href.split("#")[0]}#${QUIZ_SHARE_PREFIX}${encoded}`;
  }

  async function copySavedQuizLink() {
    if (!state.savedQuizLink) return;
    try {
      await navigator.clipboard.writeText(state.savedQuizLink);
      state.savedQuizStatus = "Đã sao chép link bài kiểm tra.";
    } catch {
      state.savedQuizStatus = "Không thể tự động sao chép. Hãy chọn link và sao chép thủ công.";
    }
    render();
  }

  function clearCurrentVocabulary() {
    const confirmed = window.confirm(
      "Xóa tất cả từ vựng hiện tại và bắt đầu danh sách mới? Các bài đã lưu sẽ không bị xóa.",
    );
    if (!confirmed) return;
    state.vocabulary = [];
    state.query = "";
    state.form = { term: "", definition: "" };
    state.editingId = null;
    state.bulkText = "";
    state.importSummary = null;
    state.shareLink = "";
    state.shareStatus = "";
    state.quizName = "";
    state.savedQuizLink = "";
    state.quizItems = [];
    state.activeQuizName = "";
    state.questionIndex = 0;
    state.answer = "";
    state.answers = [];
    state.feedback = null;
    state.view = "study";
    saveVocabulary();
    render();
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    })[char]);
  }

  function parseImport(text) {
    const imported = [];
    let skipped = 0;

    text.split(/\r?\n/).forEach((line) => {
      const source = line.trim();
      if (!source) return;

      let match = null;
      SEPARATORS.forEach((separator) => {
        const index = source.indexOf(separator);
        if (index >= 0 && (match === null || index < match.index)) {
          match = { index, separator };
        }
      });

      if (match === null) {
        skipped += 1;
        return;
      }

      const term = source.slice(0, match.index).trim();
      const definition = source.slice(match.index + match.separator.length).trim();
      if (!term || !definition) {
        skipped += 1;
        return;
      }

      imported.push({ id: createId(), term, definition });
    });

    return { imported, skipped };
  }

  function shuffle(items) {
    const copy = [...items];
    for (let index = copy.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
    }
    return copy;
  }

  function setState(updates) {
    Object.assign(state, updates);
    render();
  }

  function filteredVocabulary() {
    const term = state.query.trim().toLowerCase();
    if (!term) return state.vocabulary;
    return state.vocabulary.filter((item) =>
      `${item.term} ${item.definition}`.toLowerCase().includes(term),
    );
  }

  function reviewRows() {
    const rows = [...state.answers];
    if (state.sortMode === "incorrect-first") return rows.sort((a, b) => Number(a.correct) - Number(b.correct));
    if (state.sortMode === "correct-first") return rows.sort((a, b) => Number(b.correct) - Number(a.correct));
    return rows;
  }

  function normalizeAnswer(value) {
    return value.trim().replace(/\s+/g, " ").toLowerCase();
  }

  function stripNotes(value) {
    return value
      .replace(/\([^)]*\)/g, "")
      .replace(/\[[^\]]*\]/g, "")
      .replace(/\{[^}]*\}/g, "")
      .trim();
  }

  function answerVariants(value) {
    const base = value.trim();
    const withoutNotes = stripNotes(base);
    const candidates = new Set([base, withoutNotes]);
    [base, withoutNotes].forEach((source) => {
      source
        .split(/\s*(?:\/|;|\bor\b|\bou\b|\|)\s*/i)
        .map(stripNotes)
        .forEach((candidate) => {
          if (candidate) candidates.add(candidate);
        });
    });
    return [...candidates].map(normalizeAnswer).filter(Boolean);
  }

  function isCorrectAnswer(userAnswer, expectedAnswer) {
    const normalized = normalizeAnswer(userAnswer);
    return answerVariants(expectedAnswer).includes(normalized);
  }

  function getSoundContext() {
    soundContext = soundContext || new (window.AudioContext || window.webkitAudioContext)();
    return soundContext;
  }

  function detectCueRegions(buffer) {
    const channelCount = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const frameSize = 1024;
    const frameCount = Math.ceil(buffer.length / frameSize);
    const levels = [];
    let peak = 0;

    for (let frame = 0; frame < frameCount; frame += 1) {
      const start = frame * frameSize;
      const end = Math.min(buffer.length, start + frameSize);
      let sum = 0;
      let samples = 0;
      for (let channel = 0; channel < channelCount; channel += 1) {
        const data = buffer.getChannelData(channel);
        for (let index = start; index < end; index += 1) {
          sum += Math.abs(data[index]);
          samples += 1;
        }
      }
      const level = samples ? sum / samples : 0;
      peak = Math.max(peak, level);
      levels.push(level);
    }

    const threshold = Math.max(peak * 0.12, 0.012);
    const maxSilentGapFrames = Math.ceil(0.22 * sampleRate / frameSize);
    const rawRegions = [];
    let regionStart = null;
    let silentFrames = 0;

    levels.forEach((level, frame) => {
      if (level >= threshold) {
        if (regionStart === null) regionStart = frame;
        silentFrames = 0;
        return;
      }
      if (regionStart !== null) {
        silentFrames += 1;
        if (silentFrames > maxSilentGapFrames) {
          rawRegions.push({ startFrame: regionStart, endFrame: frame - silentFrames });
          regionStart = null;
          silentFrames = 0;
        }
      }
    });

    if (regionStart !== null) rawRegions.push({ startFrame: regionStart, endFrame: levels.length - 1 });

    return rawRegions
      .map((region) => ({
        start: Math.max(0, (region.startFrame * frameSize) / sampleRate - 0.03),
        end: Math.min(buffer.duration, ((region.endFrame + 1) * frameSize) / sampleRate + 0.05),
      }))
      .filter((region) => region.end - region.start > 0.08);
  }

  async function preloadSound() {
    if (soundLoadPromise) return soundLoadPromise;
    soundLoadPromise = (async () => {
      const context = getSoundContext();
      const response = await fetch(SOUND_SRC);
      const arrayBuffer = await response.arrayBuffer();
      soundBuffer = await context.decodeAudioData(arrayBuffer);
      const regions = detectCueRegions(soundBuffer);
      const midpoint = soundBuffer.duration / 2;
      const firstRegion = regions[0] || { start: 0, end: Math.min(midpoint, soundBuffer.duration) };
      const wrongRegion =
        regions.find((region) => region.start >= midpoint - 0.15) ||
        regions[1] ||
        { start: midpoint, end: soundBuffer.duration };
      soundCues = {
        correct: firstRegion,
        wrong: wrongRegion,
        complete: firstRegion,
      };
    })().catch(() => {
      soundLoadPromise = null;
    });
    return soundLoadPromise;
  }

  async function playQuizSound(kind) {
    await preloadSound();
    if (!soundBuffer || !soundCues) return;
    const context = getSoundContext();
    if (context.state === "suspended") await context.resume();
    const cue = soundCues[kind] || soundCues.correct;
    const source = context.createBufferSource();
    const gain = context.createGain();
    source.buffer = soundBuffer;
    gain.gain.value = 0.9;
    source.connect(gain);
    gain.connect(context.destination);
    source.start(0, cue.start, Math.max(0.08, cue.end - cue.start));
  }

  // Maps BCP-47 lang codes → ResponsiveVoice voice names (fallback only)
  const RV_VOICES = {
    "fr-FR": "French Female",
    "en-US": "US English Female",
    "en-GB": "UK English Female",
    "ja-JP": "Japanese Female",
    "ko-KR": "Korean Female",
    "zh-CN": "Chinese Female",
    "zh-TW": "Traditional Chinese Female",
    "es-ES": "Spanish Female",
    "de-DE": "Deutsch Female",
    "it-IT": "Italian Female",
    "ru-RU": "Russian Female",
    "th-TH": "Thai Female",
    "pt-BR": "Brazilian Portuguese Female",
    "vi-VN": "Vietnamese Female",
  };

  let voicesReady = null;
  function loadVoices() {
    if (voicesReady) return voicesReady;
    voicesReady = new Promise((resolve) => {
      const v = window.speechSynthesis.getVoices();
      if (v.length) { resolve(v); return; }
      let resolved = false;
      window.speechSynthesis.addEventListener("voiceschanged", function onVoices() {
        if (resolved) return;
        resolved = true;
        window.speechSynthesis.removeEventListener("voiceschanged", onVoices);
        resolve(window.speechSynthesis.getVoices());
      });
      // Safety timeout in case voiceschanged never fires
      setTimeout(() => { if (!resolved) { resolved = true; resolve(window.speechSynthesis.getVoices()); } }, 2000);
    });
    return voicesReady;
  }

  async function speak(text, lang) {
    // Strip parenthetical annotations like (adj), (v), (informal) before speaking
    text = text.replace(/\(.*?\)/g, "").replace(/\s+/g, " ").trim();
    if (!text) return;
    const targetLang = lang || state.ttsLang;

    // Prefer Web Speech API — native voices (e.g. macOS French voice) sound better
    if (window.speechSynthesis) {
      const voices = await loadVoices();
      const tl = targetLang.toLowerCase();
      const voice =
        voices.find(v => v.lang.toLowerCase() === tl) ||
        voices.find(v => v.lang.toLowerCase().startsWith(tl.split("-")[0]));
      if (voice) {
        window.speechSynthesis.cancel();
        setTimeout(() => {
          const u = new SpeechSynthesisUtterance(text);
          u.voice = voice;
          u.lang = targetLang;
          u.rate = 0.9;
          window.speechSynthesis.speak(u);
        }, 50);
        return;
      }
    }

    // Fallback: ResponsiveVoice (covers devices with no native voices installed)
    if (window.responsiveVoice) {
      responsiveVoice.speak(text, RV_VOICES[targetLang] || "US English Female", { rate: 0.9 });
    }
  }

  function submitVocabulary(event) {
    event.preventDefault();
    const term = state.form.term.trim();
    const definition = state.form.definition.trim();
    if (!term || !definition) return;

    if (state.editingId) {
      state.vocabulary = state.vocabulary.map((item) =>
        item.id === state.editingId ? { ...item, term, definition } : item,
      );
    } else {
      state.vocabulary = [{ id: createId(), term, definition }, ...state.vocabulary];
    }
    state.form = { term: "", definition: "" };
    state.editingId = null;
    state.shareLink = "";
    saveVocabulary();
    render();
  }

  function importVocabulary() {
    const parsed = parseImport(state.bulkText);
    if (parsed.imported.length > 0) {
      state.vocabulary = [...parsed.imported, ...state.vocabulary];
      state.bulkText = "";
      state.shareLink = "";
      saveVocabulary();
    }
    state.importSummary = { imported: parsed.imported.length, skipped: parsed.skipped };
    render();
  }

  function selectQuizItems(sourceItems = state.vocabulary, requestedSize = state.quizSize) {
    const custom = Number(state.customSize);
    const size = state.customSize.trim() ? custom : requestedSize;
    const safeSize = Number.isFinite(size) && size > 0 ? Math.floor(size) : requestedSize;
    return weightedSelectItems(sourceItems, Math.min(safeSize, sourceItems.length));
  }

  function generateChoiceOptions(question) {
    // Choices must be the ANSWER field, opposite of what's shown as the question prompt.
    // "term-to-def" (Nghĩa→Từ): prompt=definition, so choices=term
    // "def-to-term" (Từ→Nghĩa): prompt=term, so choices=definition
    const isTermToDef = state.quizDirection !== "def-to-term";
    const correct = isTermToDef ? question.term : question.definition;
    const pool = state.vocabulary
      .filter(item => item.id !== question.id)
      .map(item => isTermToDef ? item.term : item.definition);
    const distractors = shuffle(pool).slice(0, 3);
    return shuffle([correct, ...distractors]);
  }

  function startQuiz(sourceItems = state.vocabulary, requestedSize = state.quizSize, quizName = "") {
    const selected = selectQuizItems(sourceItems, requestedSize);
    if (selected.length === 0) return;
    const updates = {
      quizItems: selected,
      activeQuizName: quizName || "",
      questionIndex: 0,
      answer: "",
      answers: [],
      feedback: null,
      view: "quiz",
      choiceOptions: [],
    };
    if (state.quizMode === "choice" && selected.length > 0) {
      updates.choiceOptions = generateChoiceOptions(selected[0]);
    }
    setState(updates);
  }

  function saveQuizFromItems(name, items) {
    const cleanName = name.trim();
    if (!cleanName || items.length === 0) {
      state.savedQuizStatus = "Hãy đặt tên bài trước khi lưu.";
      render();
      return null;
    }
    const quiz = {
      id: createId(),
      name: cleanName,
      items: items.map(({ term, definition }) => ({ id: createId(), term, definition })),
      createdAt: new Date().toISOString(),
    };
    state.savedQuizzes = [quiz, ...state.savedQuizzes.filter((saved) => saved.name.toLowerCase() !== cleanName.toLowerCase())];
    state.savedQuizStatus = `Đã lưu bài: ${cleanName}.`;
    state.savedQuizLink = "";
    saveSavedQuizzes();
    render();
    return quiz;
  }

  function saveGeneratedQuiz() {
    saveQuizFromItems(state.quizName, state.vocabulary);
  }

  function saveCurrentQuiz() {
    const name = state.quizName || state.activeQuizName;
    saveQuizFromItems(name, state.quizItems);
  }

  function startSavedQuiz(id) {
    const quiz = state.savedQuizzes.find((item) => item.id === id)
      || BUILTIN_QUIZZES.find((item) => item.id === id);
    if (!quiz) return;
    state.quizName = quiz.name;
    startQuiz(quiz.items, quiz.items.length, quiz.name);
  }

  async function shareSavedQuiz(id) {
    const quiz = state.savedQuizzes.find((item) => item.id === id);
    if (!quiz) return;
    const longUrl = createQuizShareLink(quiz);
    state.savedQuizLink = "";
    state.savedQuizStatus = "Đang rút gọn link…";
    render();
    const short = await shortenUrl(longUrl);
    state.savedQuizLink = short;
    state.savedQuizStatus = short !== longUrl
      ? `Đã rút gọn link cho ${quiz.name}.`
      : `Đã tạo link cho ${quiz.name}.`;
    render();
  }

  function deleteSavedQuiz(id) {
    state.savedQuizzes = state.savedQuizzes.filter((item) => item.id !== id);
    state.savedQuizLink = "";
    saveSavedQuizzes();
    render();
  }

  function submitAnswer(skipped) {
    const currentQuestion = state.quizItems[state.questionIndex];
    if (!currentQuestion || state.feedback) return;
    const normalized = skipped ? "" : state.answer.trim();
    const expectedAnswer = state.quizDirection === "def-to-term" ? currentQuestion.definition : currentQuestion.term;
    const correct = !skipped && isCorrectAnswer(normalized, expectedAnswer);
    state.answers = [...state.answers, { item: currentQuestion, answer: normalized, correct, skipped }];
    state.feedback = correct ? "correct" : "incorrect";
    playQuizSound(correct ? "correct" : "wrong");
    render();
  }

  function nextQuestion() {
    if (state.questionIndex + 1 >= state.quizItems.length) {
      updatePerformance(state.answers);
      playQuizSound("complete");
      setState({ view: "results", feedback: null, answer: "" });
      return;
    }
    const nextIndex = state.questionIndex + 1;
    const updates = { questionIndex: nextIndex, answer: "", feedback: null };
    if (state.quizMode === "choice") {
      updates.choiceOptions = generateChoiceOptions(state.quizItems[nextIndex]);
    }
    setState(updates);
  }

  function retryIncorrect() {
    const incorrectItems = state.answers.filter((item) => !item.correct).map((item) => item.item);
    startQuiz(incorrectItems, incorrectItems.length);
  }

  function exportVocabulary() {
    if (state.vocabulary.length === 0) return;
    const lines = state.vocabulary.map(item => `${item.term} - ${item.definition}`);
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "vocabulary.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function renderStudy() {
    const rows = filteredVocabulary();
    const perf = loadPerformance();
    return `
      ${state.vocabulary.length === 0 ? `
        <section class="empty-state">
          <h2>Chưa có từ vựng.</h2>
          <p>Thêm từ hoặc nhập danh sách để bắt đầu.</p>
        </section>
      ` : ""}

      <section class="grid two-columns">
        <form class="card stack" data-action="vocab-form">
          <h2>${state.editingId ? "Chỉnh sửa từ vựng" : "Thêm từ vựng"}</h2>
          <label>
            <span>Từ cần học</span>
            <input data-field="term" value="${escapeHtml(state.form.term)}" />
          </label>
          <label>
            <span>Nghĩa</span>
            <input data-field="definition" value="${escapeHtml(state.form.definition)}" />
          </label>
          <div class="button-row">
            <button class="primary-button" type="submit">${state.editingId ? "Lưu" : "Thêm"}</button>
            ${state.editingId ? `<button class="secondary-button" type="button" data-action="cancel-edit">Hủy</button>` : ""}
          </div>
        </form>

        <section class="card stack">
          <h2>Nhập hàng loạt</h2>
          <textarea rows="8" data-field="bulk" placeholder="apple = quả táo&#10;happy: vui vẻ&#10;run -> chạy&#10;book | sách">${escapeHtml(state.bulkText)}</textarea>
          <button class="primary-button" type="button" data-action="import">Nhập</button>
          ${state.importSummary ? `<p class="summary" aria-live="polite">Imported: ${state.importSummary.imported} · Skipped: ${state.importSummary.skipped}</p>` : ""}
          <button class="secondary-button" type="button" data-action="clear-vocabulary" ${state.vocabulary.length === 0 ? "disabled" : ""}>Xóa danh sách hiện tại</button>
        </section>
      </section>

      <section class="card stack">
        <div class="section-head">
          <h2>Chia sẻ từ vựng</h2>
          <div class="button-row">
            <button class="primary-button" type="button" data-action="create-share" ${state.vocabulary.length === 0 ? "disabled" : ""}>Tạo link chia sẻ</button>
            <button class="secondary-button" type="button" data-action="export" ${state.vocabulary.length === 0 ? "disabled" : ""}>Xuất .txt</button>
          </div>
        </div>
        ${state.shareLink ? `
          <label>
            <span>Link chia sẻ danh sách</span>
            <input readonly data-field="share-link" value="${escapeHtml(state.shareLink)}" />
          </label>
          <button class="secondary-button" type="button" data-action="copy-share">Sao chép link</button>
        ` : ""}
        ${state.shareStatus ? `<p class="summary" aria-live="polite">${escapeHtml(state.shareStatus)}</p>` : ""}
      </section>

      <section class="card stack">
        <div class="section-head">
          <h2>Từ vựng</h2>
          <input class="search-input" data-field="query" value="${escapeHtml(state.query)}" placeholder="Tìm kiếm..." />
        </div>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Từ cần học</th><th>Nghĩa</th><th>Thao tác</th></tr>
            </thead>
            <tbody>
              ${rows.map((item) => {
                if (item.id === state.inlineEditId) {
                  return `
                <tr class="inline-edit-row">
                  <td><input class="inline-input" data-field="inline-term" value="${escapeHtml(state.inlineEditTerm)}" /></td>
                  <td><input class="inline-input" data-field="inline-def" value="${escapeHtml(state.inlineEditDef)}" /></td>
                  <td class="actions">
                    <button class="text-button" type="button" data-action="inline-save" data-id="${item.id}">Lưu</button>
                    <button class="text-button" type="button" data-action="inline-cancel">Hủy</button>
                  </td>
                </tr>`;
                }
                return `
                <tr>
                  <td>
                    ${escapeHtml(item.term)}
                    <button class="speak-btn" type="button" data-action="speak" data-text="${escapeHtml(item.term)}" data-lang="${escapeHtml(state.ttsLang)}" title="Nghe phát âm">🔊</button>
                  </td>
                  <td>${escapeHtml(item.definition)}</td>
                  <td class="actions">
                    <button class="text-button" type="button" data-action="edit" data-id="${item.id}">Sửa</button>
                    <button class="text-button danger" type="button" data-action="delete" data-id="${item.id}">Xóa</button>
                  </td>
                </tr>`;
              }).join("")}
            </tbody>
          </table>
        </div>
      </section>

      <section class="card stack quiz-builder">
        <h2>Tạo bài kiểm tra</h2>
        <label>
          <span>Tên bài</span>
          <input data-field="quiz-name" value="${escapeHtml(state.quizName)}" placeholder="Ví dụ: Chủ đề 1, Tuần 3..." />
        </label>
        <div class="size-options">
          <button class="${state.quizDirection === "term-to-def" ? "selected" : ""}" type="button" data-action="direction" data-dir="term-to-def">Nghĩa → Từ</button>
          <button class="${state.quizDirection === "def-to-term" ? "selected" : ""}" type="button" data-action="direction" data-dir="def-to-term">Từ → Nghĩa</button>
        </div>
        <div class="size-options">
          <button class="${state.quizMode === 'type' ? 'selected' : ''}" type="button" data-action="mode" data-mode="type">Gõ đáp án</button>
          <button class="${state.quizMode === 'choice' ? 'selected' : ''}" type="button" data-action="mode" data-mode="choice">Trắc nghiệm</button>
        </div>
        <div class="size-options">
          ${QUIZ_SIZES.map((size) => `
            <button class="${state.quizSize === size && !state.customSize ? "selected" : ""}" type="button" data-action="size" data-size="${size}">
              ${size} câu
            </button>
          `).join("")}
          <label class="custom-size">
            <span>Tùy chỉnh</span>
            <input type="number" min="1" data-field="custom-size" value="${escapeHtml(state.customSize)}" />
          </label>
        </div>
        <label>
          <span>Ngôn ngữ đang học</span>
          <select data-field="tts-lang">
            ${[
              ["en-US", "🇺🇸 Tiếng Anh (Mỹ)"],
              ["en-GB", "🇬🇧 Tiếng Anh (Anh)"],
            ].map(([code, label]) => `<option value="${code}" ${state.ttsLang === code ? "selected" : ""}>${label}</option>`).join("")}
          </select>
        </label>
        <div class="button-row">
          <button class="primary-button large-button" type="button" data-action="start-quiz" ${state.vocabulary.length === 0 ? "disabled" : ""}>Bắt đầu</button>
          <button class="secondary-button large-button" type="button" data-action="save-generated-quiz" ${state.vocabulary.length === 0 ? "disabled" : ""}>Lưu bài</button>
          <button class="secondary-button large-button" type="button" data-action="clear-vocabulary" ${state.vocabulary.length === 0 ? "disabled" : ""}>Danh sách mới</button>
        </div>
        ${state.vocabulary.length > 0 ? `<p class="summary">Nếu số câu lớn hơn danh sách, tất cả ${state.vocabulary.length} từ sẽ được dùng.</p>` : ""}
      </section>

      <section class="card stack">
        <div class="section-head">
          <h2>Bài kiểm tra đã lưu</h2>
          <span class="summary">${state.savedQuizzes.length} đã lưu</span>
        </div>
        <div class="saved-quiz-list">
          ${BUILTIN_QUIZZES.map((quiz) => `
            <article class="saved-quiz-item builtin-quiz-item">
              <div>
                <h3>${escapeHtml(quiz.name)}</h3>
                <p class="summary">${quiz.items.length} từ · Có sẵn</p>
              </div>
              <div class="button-row">
                <button class="primary-button" type="button" data-action="start-saved-quiz" data-id="${quiz.id}">Bắt đầu</button>
              </div>
            </article>
          `).join("")}
          ${state.savedQuizzes.map((quiz) => `
            <article class="saved-quiz-item">
              <div>
                <h3>${escapeHtml(quiz.name)}</h3>
                <p class="summary">${quiz.items.length} câu</p>
              </div>
              <div class="button-row">
                <button class="primary-button" type="button" data-action="start-saved-quiz" data-id="${quiz.id}">Bắt đầu</button>
                <button class="secondary-button" type="button" data-action="share-saved-quiz" data-id="${quiz.id}">Chia sẻ</button>
                <button class="text-button danger" type="button" data-action="delete-saved-quiz" data-id="${quiz.id}">Xóa</button>
              </div>
            </article>
          `).join("")}
          ${state.savedQuizzes.length === 0 ? `<p class="summary">Chưa có bài nào được lưu. Đặt tên và lưu bài, hoặc lưu từ màn hình kết quả.</p>` : ""}
        </div>
        ${state.savedQuizLink ? `
          <label>
            <span>Link bài kiểm tra</span>
            <input readonly data-field="saved-quiz-link" value="${escapeHtml(state.savedQuizLink)}" />
          </label>
          <button class="secondary-button" type="button" data-action="copy-saved-quiz">Sao chép link</button>
        ` : ""}
        ${state.savedQuizStatus ? `<p class="summary" aria-live="polite">${escapeHtml(state.savedQuizStatus)}</p>` : ""}
      </section>
    `;
  }

  function renderQuiz() {
    const currentQuestion = state.quizItems[state.questionIndex];
    const progressPercent = state.quizItems.length ? Math.round((state.answers.length / state.quizItems.length) * 100) : 0;
    const latest = state.answers[state.answers.length - 1];
    const isTermToDef = state.quizDirection !== "def-to-term";
    const prompt = isTermToDef ? currentQuestion.definition : currentQuestion.term;
    const promptLabel = isTermToDef ? "Nghĩa:" : "Từ cần học:";
    const fullAnswer = isTermToDef ? currentQuestion.term : currentQuestion.definition;
    const isChoiceMode = state.quizMode === "choice";
    const correctAnswer = isTermToDef ? currentQuestion.term : currentQuestion.definition;

    return `
      <section class="quiz-screen card">
        <div class="quiz-progress">
          <p>${state.activeQuizName ? `${escapeHtml(state.activeQuizName)} · ` : ""}Câu ${state.questionIndex + 1} / ${state.quizItems.length}</p>
          <strong>${progressPercent}%</strong>
          <div class="progress-track" aria-label="${progressPercent}% complete"><span style="width: ${progressPercent}%"></span></div>
        </div>
        <button class="secondary-button clear-quiz-button" type="button" data-action="clear-vocabulary">Xóa và bắt đầu lại</button>

        <div class="question-block">
          <span>${escapeHtml(promptLabel)}</span>
          <div class="question-word-row">
            <h1>${escapeHtml(prompt)}</h1>
            ${!isTermToDef ? `<button class="speak-btn" type="button" data-action="speak" data-text="${escapeHtml(currentQuestion.term)}" data-lang="${escapeHtml(state.ttsLang)}" title="Nghe phát âm">🔊</button>` : ""}
          </div>
        </div>

        ${isChoiceMode ? `
          <div class="choice-options">
            ${state.choiceOptions.map(option => {
              let cls = "choice-btn";
              if (state.feedback) {
                if (option === correctAnswer) cls += " choice-correct";
                else if (option === (latest && latest.answer)) cls += " choice-wrong";
              }
              return `<button class="${cls}" type="button" data-action="choose" data-choice="${escapeHtml(option)}" ${state.feedback ? "disabled" : ""}>${escapeHtml(option)}</button>`;
            }).join("")}
          </div>
        ` : `
          <label class="answer-label">
            <span>Trả lời:</span>
            <input data-field="answer" value="${escapeHtml(state.answer)}" ${state.feedback ? "disabled" : ""} autocorrect="off" autocapitalize="off" spellcheck="false" autofocus />
          </label>

          ${!state.feedback ? `
            <div class="button-row">
              <button class="primary-button large-button" type="button" data-action="submit-answer">Gửi</button>
              <button class="secondary-button large-button" type="button" data-action="skip-answer">Bỏ qua</button>
            </div>
          ` : ""}
        `}

        ${state.feedback ? `
          <section class="feedback ${state.feedback}">
            <h2>${state.feedback === "correct" ? "✅ Đúng rồi!" : "❌ Sai rồi"}</h2>
            ${state.feedback === "incorrect" ? `
              <p>Câu trả lời của bạn: ${escapeHtml(latest && latest.answer ? latest.answer : "Skipped")}</p>
            ` : ""}
            <div class="feedback-answer-row">
              <p>Đáp án đúng: <strong>${escapeHtml(fullAnswer)}</strong></p>
              ${isTermToDef ? `<button class="speak-btn" type="button" data-action="speak" data-text="${escapeHtml(currentQuestion.term)}" data-lang="${escapeHtml(state.ttsLang)}" title="Nghe phát âm">🔊</button>` : ""}
            </div>
            <button class="primary-button large-button" type="button" data-action="continue">Tiếp tục</button>
          </section>
        ` : ""}
      </section>
    `;
  }

  function renderResults() {
    const incorrectAnswers = state.answers.filter((item) => !item.correct);
    const correctCount = state.answers.length - incorrectAnswers.length;
    const accuracy = state.answers.length ? Math.round((correctCount / state.answers.length) * 100) : 0;

    return `
      <section class="card stack">
        <div class="results-head">
          <h1>${state.activeQuizName ? `${escapeHtml(state.activeQuizName)} – Hoàn thành!` : "Hoàn thành!"}</h1>
          <div class="results-grid">
            <p>Đúng: ${correctCount}</p>
            <p>Sai: ${incorrectAnswers.length}</p>
            <p>Độ chính xác: ${accuracy}%</p>
          </div>
        </div>

        <section class="save-completed">
          <label>
            <span>Lưu bài kiểm tra</span>
            <input data-field="quiz-name" value="${escapeHtml(state.quizName || state.activeQuizName)}" placeholder="Đặt tên cho bài..." />
          </label>
          <button class="secondary-button" type="button" data-action="save-current-quiz">Lưu bài này</button>
          ${state.savedQuizStatus ? `<p class="summary" aria-live="polite">${escapeHtml(state.savedQuizStatus)}</p>` : ""}
        </section>

        <div class="section-head">
          <h2>Xem lại</h2>
          <select data-field="sort-mode">
            <option value="incorrect-first" ${state.sortMode === "incorrect-first" ? "selected" : ""}>Sai trước</option>
            <option value="correct-first" ${state.sortMode === "correct-first" ? "selected" : ""}>Đúng trước</option>
            <option value="all" ${state.sortMode === "all" ? "selected" : ""}>Theo thứ tự</option>
          </select>
        </div>

        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>${state.quizDirection === "def-to-term" ? "Từ cần học" : "Nghĩa"}</th>
                <th>Câu trả lời</th>
                <th>Đáp án đúng</th>
                <th>Kết quả</th>
              </tr>
            </thead>
            <tbody>
              ${reviewRows().map((row) => {
                const isTermToDef = state.quizDirection !== "def-to-term";
                const questionShown = isTermToDef ? row.item.definition : row.item.term;
                const correctAnswer = isTermToDef ? row.item.term : row.item.definition;
                return `
                  <tr class="${row.correct ? "correct-row" : "incorrect-row"}">
                    <td>${escapeHtml(questionShown)}</td>
                    <td>${escapeHtml(row.answer || "Skipped")}</td>
                    <td>
                      ${escapeHtml(correctAnswer)}
                      ${isTermToDef ? `<button class="speak-btn" type="button" data-action="speak" data-text="${escapeHtml(row.item.term)}" data-lang="${escapeHtml(state.ttsLang)}" title="Nghe">🔊</button>` : ""}
                    </td>
                    <td>${row.correct ? "Đúng" : "Sai"}</td>
                  </tr>
                `;
              }).join("")}
            </tbody>
          </table>
        </div>

        <div class="button-row">
          <button class="primary-button large-button" type="button" data-action="retry" ${incorrectAnswers.length === 0 ? "disabled" : ""}>Làm lại câu sai</button>
          <button class="secondary-button large-button" type="button" data-action="study">Về từ vựng</button>
        </div>
      </section>
    `;
  }

  function render() {
    root.innerHTML = `
      <main class="app-shell">
        <header class="topbar">
          <button class="brand" type="button" data-action="study">Luyện Từ Vựng</button>
          <div class="topbar-actions">
            <button class="secondary-button" type="button" data-action="study">Từ vựng</button>
            <button class="secondary-button" type="button" data-action="clear-vocabulary" ${state.vocabulary.length === 0 ? "disabled" : ""}>Bài mới</button>
          </div>
        </header>
        ${state.view === "quiz" ? renderQuiz() : state.view === "results" ? renderResults() : renderStudy()}
      </main>
    `;
    bindEvents();
  }

  function bindEvents() {
    root.querySelectorAll("[data-field]").forEach((element) => {
      element.addEventListener("input", (event) => {
        const field = event.currentTarget.dataset.field;
        const value = event.currentTarget.value;
        if (field === "term") state.form.term = value;
        if (field === "definition") state.form.definition = value;
        if (field === "bulk") state.bulkText = value;
        if (field === "query") state.query = value;
        if (field === "custom-size") state.customSize = value;
        if (field === "answer") state.answer = value;
        if (field === "quiz-name") state.quizName = value;
        if (field === "inline-term") state.inlineEditTerm = value;
        if (field === "inline-def") state.inlineEditDef = value;
        if (field === "tts-lang") {
          state.ttsLang = value;
          try { localStorage.setItem(TTS_LANG_KEY, value); } catch {}
        }
      });

      element.addEventListener("change", (event) => {
        const field = event.currentTarget.dataset.field;
        if (field === "sort-mode") setState({ sortMode: event.currentTarget.value });
        if (field === "tts-lang") {
          state.ttsLang = event.currentTarget.value;
          try { localStorage.setItem(TTS_LANG_KEY, event.currentTarget.value); } catch {}
          render();
        }
      });
    });

    const form = root.querySelector("[data-action='vocab-form']");
    if (form) form.addEventListener("submit", submitVocabulary);

    const answerInput = root.querySelector("[data-field='answer']");
    if (answerInput) {
      answerInput.focus();
      answerInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          submitAnswer(false);
        }
      });
    }

    root.querySelectorAll("[data-action]").forEach((button) => {
      button.addEventListener("click", (event) => {
        const action = event.currentTarget.dataset.action;
        const id = event.currentTarget.dataset.id;
        if (action === "study") setState({ view: "study" });
        if (action === "cancel-edit") setState({ form: { term: "", definition: "" }, editingId: null });
        if (action === "import") importVocabulary();
        if (action === "edit") {
          const item = state.vocabulary.find((entry) => entry.id === id);
          if (item) setState({ inlineEditId: item.id, inlineEditTerm: item.term, inlineEditDef: item.definition });
        }
        if (action === "inline-save") {
          const term = state.inlineEditTerm.trim();
          const def = state.inlineEditDef.trim();
          if (term && def) {
            state.vocabulary = state.vocabulary.map((entry) =>
              entry.id === id ? { ...entry, term, definition: def } : entry
            );
            saveVocabulary();
          }
          setState({ inlineEditId: null, inlineEditTerm: "", inlineEditDef: "" });
        }
        if (action === "inline-cancel") {
          setState({ inlineEditId: null, inlineEditTerm: "", inlineEditDef: "" });
        }
        if (action === "delete") {
          state.vocabulary = state.vocabulary.filter((entry) => entry.id !== id);
          state.shareLink = "";
          saveVocabulary();
          render();
        }
        if (action === "create-share") createShareLink();
        if (action === "copy-share") copyShareLink();
        if (action === "copy-saved-quiz") copySavedQuizLink();
        if (action === "clear-vocabulary") clearCurrentVocabulary();
        if (action === "size") setState({ quizSize: Number(event.currentTarget.dataset.size), customSize: "" });
        if (action === "direction") setState({ quizDirection: event.currentTarget.dataset.dir });
        if (action === "mode") setState({ quizMode: event.currentTarget.dataset.mode });
        if (action === "speak") {
          speak(event.currentTarget.dataset.text, event.currentTarget.dataset.lang);
          const answerInput = root.querySelector("[data-field='answer']");
          if (answerInput && !state.feedback) answerInput.focus();
        }
        if (action === "choose") {
          state.answer = event.currentTarget.dataset.choice;
          submitAnswer(false);
        }
        if (action === "export") exportVocabulary();
        if (action === "start-quiz") startQuiz(state.vocabulary, state.quizSize, state.quizName.trim());
        if (action === "save-generated-quiz") saveGeneratedQuiz();
        if (action === "save-current-quiz") saveCurrentQuiz();
        if (action === "start-saved-quiz") startSavedQuiz(id);
        if (action === "share-saved-quiz") shareSavedQuiz(id);
        if (action === "delete-saved-quiz") deleteSavedQuiz(id);
        if (action === "submit-answer") submitAnswer(false);
        if (action === "skip-answer") submitAnswer(true);
        if (action === "continue") nextQuestion();
        if (action === "retry") retryIncorrect();
      });
    });
  }


  render();
  syncFromCloud();
})();
