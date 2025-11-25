import { Link } from 'react-router-dom';
import { useState } from 'react';

function AboutPage() {
  const [isReady, setIsReady] = useState(false);

  const handleReady = () => {
    setIsReady(true);
  };

  const handleNotReady = () => {
    setIsReady(false);
  };

  return (
    <>
      <div className="ranger-container">
        <div className="ranger-content">
          <header className="ranger-header">
            <h1 className="ranger-title">
              RANGER гэж юу юм?
            </h1>
            <p className="ranger-subtitle">
              RANGER бол дүр үзүүлэлтээс халсан, чин сэтгэлийн
              жижиг тойрог. Энд хэн нэгнийг гуйж аваачдаггүй,
              хэн нэгэн өөрөө бэлэн бол өөрөө ирдэг.
            </p>
          </header>

          {/* Provocative intro */}
          <section className="ranger-intro-card">
            <p className="ranger-intro-text">
              Чи жинхэнэ соёлтой худалч, хуурамч бүдүүлэг хүн байж болно. 
              Чи хэн ч байж болно. Хамгийн чухал нь{" "}
              <span className="ranger-highlight">
                тийм байгаагаа өөрөө хүлээн зөвшөөрч
              </span>{" "}
              чаддаг уу, үгүй юу.
            </p>

            <div className="ranger-buttons">
              <button 
                onClick={handleReady}
                className={`ranger-btn ${isReady ? 'ranger-btn-ready' : 'ranger-btn-default'}`}
              >
                Би бэлэн байна
              </button>
              <button 
                onClick={handleNotReady}
                className={`ranger-btn ${!isReady ? 'ranger-btn-default' : 'ranger-btn-inactive'}`}
              >
                Би бэлэн биш байна
              </button>
            </div>

            <p className="ranger-warning">
              "Юун хөгжилтэй юм бэ?", "Яах гэж ийм юм хийсэн юм бол?",
              "Яг энэ мөчөөс эхлэн RANGER…" гэх мэт бодлууд толгойноос чинь салж өгөхгүй байвал
              <span className="ranger-warning-highlight"> шууд энэ хуудаснаас гарсан нь дээр</span>.
              Хэн ч чамаас энд байхыг гуйгаагүй. Мөн RANGER-үүдэд:
              <span className="ranger-warning-block">
                Хэн ч хэнийг ч хүчээр авчрах ёсгүй.
              </span>
            </p>
          </section>

          {/* Rules */}
          <section className="ranger-rules-section">
            <h2 className="ranger-rules-title">
              ДҮРЭМ
              <span className="ranger-rules-subtitle">
                ( энд зөвхөн чин сэтгэлээсээ ярилцана )
              </span>
            </h2>

            <div className="ranger-rules-card">
              <ol className="ranger-rules-list">
                <li>
                  <span className="ranger-rule-number">1.</span>{" "}
                  Энд зөвхөн чин сэтгэлээсээ ярилцана.
                </li>
                <li>
                  <span className="ranger-rule-number">2.</span>{" "}
                  Энд хэн ч хэнтэй ч зодолдохгүй. Учир нь бид RANGER-үүд
                </li>
                <li>
                  <span className="ranger-rule-number">3.</span>{" "}
                  Маргаан үүсвэл гар барилдаанаар шийдвэрлэнэ. Хэн ч ялсан 
                  эцэст нь эвлэрнэ.
                </li>
                <li>
                  <span className="ranger-rule-number">4.</span>{" "}
                  Дүрэм нэгийг дагаж мөрдөх.
                </li>
                <li>
                  <span className="ranger-rule-number">5.</span>{" "}
                  Эмэгтэйчүүдийг бишрэн шүтэх.
                </li>
                <li>
                  <span className="ranger-rule-number">6.</span>{" "}
                  Эрчүүдийг хүндэтгэх.
                </li>
                <li>
                  <span className="ranger-rule-number">7.</span>{" "}
                  Дүрэм тавыг ягштал биелүүлэх, бие биедээ сануулж байх.
                </li>
                <li>
                  <span className="ranger-rule-number">8.</span>{" "}
                  <span className="ranger-hashtags">
                    #love, #peace, #balance
                  </span>{" "}
                  гэсэн сэдвүүдээр санах бүрдээ ярилцаж, утгыг нь хамтдаа олох.
                </li>
                <li>
                  <span className="ranger-rule-number">9.</span>{" "}
                  Дөрвөн мөртийг цээжилж, оюун санаандаа биелүүлэх.
                </li>
              </ol>
            </div>
          </section>

          {/* Poem */}
          <section className="ranger-poem">
            <p className="ranger-poem-label">
              Ranger-ийн тангараг
            </p>
            <p className="ranger-poem-text">
              Өглөө сэрээд мөрөөднө{"\n"}
              Өдөр харин хөгжилдөнө{"\n"}
              Орой болоход бүжиглэнэ{"\n"}
              Тэгээд хүслээ шивнэнэ
            </p>
          </section>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link to="/" className="btn">Leaderboard руу буцах</Link>
      </div>
    </>
  );
}

export default AboutPage;
