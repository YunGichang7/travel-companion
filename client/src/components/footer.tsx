import { Facebook, Instagram, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-navy text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold mb-4 korean-heading">TripPick</h3>
            <p className="text-gray-300 mb-6 korean-text">새로운 방식으로 여행지를 발견하고, 당신만의 특별한 여행을 만들어보세요.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 korean-heading">서비스</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors korean-text">랜덤 추천</a></li>
              <li><a href="#" className="hover:text-white transition-colors korean-text">취향별 찾기</a></li>
              <li><a href="#" className="hover:text-white transition-colors korean-text">인기 여행지</a></li>
              <li><a href="#" className="hover:text-white transition-colors korean-text">여행 가이드</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 korean-heading">고객지원</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors korean-text">자주 묻는 질문</a></li>
              <li><a href="#" className="hover:text-white transition-colors korean-text">문의하기</a></li>
              <li><a href="#" className="hover:text-white transition-colors korean-text">개인정보처리방침</a></li>
              <li><a href="#" className="hover:text-white transition-colors korean-text">이용약관</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
          <p className="korean-text">&copy; 2024 TripPick. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
