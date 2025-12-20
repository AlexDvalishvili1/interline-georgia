import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { RevealSection } from "@/components/animations";
import { useStaggerReveal } from "@/hooks/useRevealOnScroll";

// Same placeholder data - will be replaced with database query in Phase 2
const placeholderPosts = [
  {
    id: "1",
    slug: "summer-cruise-mediterranean",
    category: "offer",
    title: {
      ka: "ხმელთაშუა ზღვის საზაფხულო კრუიზი",
      ru: "Летний круиз по Средиземному морю",
      en: "Summer Mediterranean Cruise",
    },
    excerpt: {
      ka: "აღმოაჩინეთ ხმელთაშუა ზღვის ულამაზესი კუნძულები და ნავსადგურები ჩვენი ექსკლუზიური კრუიზით.",
      ru: "Откройте для себя красивейшие острова и порты Средиземного моря в нашем эксклюзивном круизе.",
      en: "Discover the most beautiful islands and ports of the Mediterranean with our exclusive cruise.",
    },
    content: {
      ka: "ჩვენი ხმელთაშუა ზღვის კრუიზი გთავაზობთ დაუვიწყარ მოგზაურობას ევროპის ყველაზე ლამაზ სანაპიროებზე. თქვენ მოინახულებთ იტალიას, საბერძნეთს, ესპანეთს და საფრანგეთს. კრუიზი მოიცავს ყველა კვებას, გართობას და ექსკურსიებს.\n\nმარშრუტი: ბარსელონა → მარსელი → რომი → ათენი → სანტორინი → ვენეცია\n\nრა შედის:\n- 7 ღამე ლუქს გემზე\n- ყველა კვება\n- ექსკურსიები ყველა პორტში\n- გართობა და ღონისძიებები\n- ტრანსფერი\n\nდაჯავშნეთ ახლავე და მიიღეთ სპეციალური ფასი!",
      ru: "Наш средиземноморский круиз предлагает незабываемое путешествие по самым красивым побережьям Европы. Вы посетите Италию, Грецию, Испанию и Францию. Круиз включает все питание, развлечения и экскурсии.\n\nМаршрут: Барселона → Марсель → Рим → Афины → Санторини → Венеция\n\nЧто включено:\n- 7 ночей на люкс-лайнере\n- Все питание\n- Экскурсии во всех портах\n- Развлечения и мероприятия\n- Трансфер\n\nЗабронируйте сейчас и получите специальную цену!",
      en: "Our Mediterranean cruise offers an unforgettable journey along the most beautiful coastlines of Europe. You will visit Italy, Greece, Spain, and France. The cruise includes all meals, entertainment, and excursions.\n\nRoute: Barcelona → Marseille → Rome → Athens → Santorini → Venice\n\nWhat's included:\n- 7 nights on a luxury liner\n- All meals\n- Excursions at all ports\n- Entertainment and events\n- Transfer\n\nBook now and get a special price!",
    },
    createdAt: "2024-12-15",
    coverImageUrl: "https://images.unsplash.com/photo-1548574505-5e239809ee19?w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80",
      "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600&q=80",
    ],
  },
  {
    id: "2",
    slug: "dubai-tour-package",
    category: "offer",
    title: {
      ka: "დუბაის ტურ-პაკეტი",
      ru: "Турпакет в Дубай",
      en: "Dubai Tour Package",
    },
    excerpt: {
      ka: "5 ღამე დუბაიში ყველაფრის ჩათვლით - სასტუმრო, ტრანსფერი, ექსკურსიები.",
      ru: "5 ночей в Дубае с полным пакетом - отель, трансфер, экскурсии.",
      en: "5 nights in Dubai all-inclusive - hotel, transfer, excursions.",
    },
    content: {
      ka: "დუბაი - თანამედროვე არქიტექტურის, ლუქსის და ტრადიციების უნიკალური შერწყმა. ჩვენი ტურ-პაკეტი გაძლევთ საშუალებას აღმოაჩინოთ ეს საოცარი ქალაქი კომფორტულად.\n\nპროგრამა მოიცავს:\n- ბურჯ ხალიფას დათვალიერება\n- უდაბნოს საფარი\n- დუბაი მოლი და აკვარიუმი\n- ძველი დუბაის ტური\n- ნავით გასეირნება\n\n5 ღამე 4* სასტუმროში საუზმით და ყველა ტრანსფერით.",
      ru: "Дубай - уникальное сочетание современной архитектуры, роскоши и традиций. Наш турпакет позволяет комфортно открыть для себя этот удивительный город.\n\nПрограмма включает:\n- Посещение Бурдж-Халифа\n- Сафари по пустыне\n- Дубай Молл и аквариум\n- Тур по старому Дубаю\n- Прогулка на лодке\n\n5 ночей в 4* отеле с завтраком и всеми трансферами.",
      en: "Dubai - a unique blend of modern architecture, luxury, and traditions. Our tour package allows you to discover this amazing city in comfort.\n\nProgram includes:\n- Burj Khalifa visit\n- Desert safari\n- Dubai Mall and Aquarium\n- Old Dubai tour\n- Boat cruise\n\n5 nights in a 4* hotel with breakfast and all transfers.",
    },
    createdAt: "2024-12-10",
    coverImageUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80",
    gallery: [],
  },
];

const OfferDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t, language } = useLanguage();

  const post = placeholderPosts.find((p) => p.slug === slug);
  const { containerRef: galleryRef, visibleItems: galleryVisible } = useStaggerReveal(post?.gallery?.length || 0);

  if (!post) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center">
        <h1 className="text-2xl font-heading font-bold mb-4">Post not found</h1>
        <Button asChild className="transition-all duration-300 hover:scale-105">
          <Link to="/offers">
            <ArrowLeft className="mr-2" size={16} />
            {t("offers.title")}
          </Link>
        </Button>
      </div>
    );
  }

  const categoryLabels: Record<string, string> = {
    offer: t("offers.tabs.offers"),
    promotion: t("offers.tabs.promotions"),
    news: t("offers.tabs.news"),
  };

  return (
    <div className="flex flex-col">
      {/* Hero Image */}
      <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <div className="absolute inset-0 image-placeholder">
          <img
            src={post.coverImageUrl}
            alt={post.title[language as keyof typeof post.title]}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
        </div>
        <div className="absolute inset-0 flex items-end">
          <div className="container-custom pb-12">
            <RevealSection>
              <Link
                to="/offers"
                className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground mb-4 transition-all duration-300 hover:-translate-x-1"
              >
                <ArrowLeft size={16} />
                {t("offers.title")}
              </Link>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-primary-foreground max-w-3xl">
                {post.title[language as keyof typeof post.title]}
              </h1>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            {/* Meta */}
            <RevealSection delay={100}>
              <div className="flex flex-wrap items-center gap-4 mb-8 pb-8 border-b border-border">
                <span className="inline-flex items-center gap-2 text-sm text-accent">
                  <Tag size={14} />
                  {categoryLabels[post.category]}
                </span>
                <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar size={14} />
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
              </div>
            </RevealSection>

            {/* Excerpt */}
            <RevealSection delay={200}>
              <p className="text-lg text-muted-foreground mb-8">
                {post.excerpt[language as keyof typeof post.excerpt]}
              </p>
            </RevealSection>

            {/* Content */}
            <RevealSection delay={300}>
              <div className="prose prose-lg max-w-none">
                {post.content[language as keyof typeof post.content].split("\n\n").map((paragraph, i) => (
                  <p key={i} className="text-foreground mb-4 whitespace-pre-line">
                    {paragraph}
                  </p>
                ))}
              </div>
            </RevealSection>

            {/* Gallery */}
            {post.gallery && post.gallery.length > 0 && (
              <RevealSection delay={400} className="mt-12">
                <h3 className="text-xl font-heading font-semibold mb-6">Gallery</h3>
                <div ref={galleryRef as React.RefObject<HTMLDivElement>} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {post.gallery.map((img, i) => (
                    <div
                      key={i}
                      className="aspect-square rounded-lg overflow-hidden image-placeholder group transition-all duration-500 ease-out"
                      style={{
                        opacity: galleryVisible[i] ? 1 : 0,
                        transform: galleryVisible[i] ? "scale(1)" : "scale(0.95)",
                      }}
                    >
                      <img
                        src={img}
                        alt={`Gallery image ${i + 1}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  ))}
                </div>
              </RevealSection>
            )}

            {/* CTA */}
            <RevealSection delay={500} className="mt-12">
              <div className="p-8 bg-secondary rounded-xl text-center transition-all duration-300 hover:shadow-lg">
                <h3 className="text-xl font-heading font-semibold mb-4">
                  {t("contact.title")}
                </h3>
                <div className="flex flex-wrap justify-center gap-4">
                  <a
                    href="tel:+995322000000"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-md font-medium hover:bg-accent/90 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    +995 32 200 00 00
                  </a>
                  <a
                    href="https://wa.me/995322000000"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 border border-border rounded-md font-medium hover:bg-muted transition-all duration-300 hover:scale-105"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>
            </RevealSection>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OfferDetail;
