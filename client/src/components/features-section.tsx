export default function FeaturesSection() {
  return (
    <section className="py-20 bg-gradient-to-r from-primary/5 to-secondary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold text-navy mb-4 korean-heading">✨ TripPick만의 특별함</h3>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
              🎯
            </div>
            <h4 className="text-xl font-semibold text-navy mb-2 korean-heading">랜덤 발견의 재미</h4>
            <p className="text-gray-600 korean-text">예상치 못한 숨겨진 명소를 발견하는 즐거움</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
              💕
            </div>
            <h4 className="text-xl font-semibold text-navy mb-2 korean-heading">취향 맞춤 추천</h4>
            <p className="text-gray-600 korean-text">스와이프로 찾아가는 나만의 완벽한 여행지</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center text-navy text-2xl mx-auto mb-4">
              🗺️
            </div>
            <h4 className="text-xl font-semibold text-navy mb-2 korean-heading">상세한 정보</h4>
            <p className="text-gray-600 korean-text">여행지의 특색과 매력을 한눈에 파악</p>
          </div>
        </div>
      </div>
    </section>
  );
}
