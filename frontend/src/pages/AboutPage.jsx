import { Link } from 'react-router-dom';
import './AboutPage.css';

function AboutPage() {
  return (
    <>
      <div className="hero">
        <div className="hero-title">Мазаалай хамгаалалт</div>
        <div className="hero-sub">
          Говийн эзэн Мазаалай бол дэлхийн хамгийн ховор баавгайн төрөлд тооцогддог.
        </div>
      </div>
      
      <div className="board" style={{ marginTop: 'var(--space-xl)' }}>
        <div className="board-header">
          <div>
            <div className="board-title">Бидний зорилго</div>
          </div>
        </div>
        <div style={{ lineHeight: 'var(--line-height-relaxed)', color: 'var(--text-secondary)' }}>
          <p style={{ marginBottom: 'var(--space-md)' }}>
            Мазаалай (Ursus arctos gobiensis) нь Монголын Говьд амьдардаг маш ховор баавгайн дэд төрөл юм. 
            Тэдний тоо маш цөөхөн бөгөөд устах аюулд орсон байна.
          </p>
          <p style={{ marginBottom: 'var(--space-md)' }}>
            Энэхүү систем нь байгаль хамгаалагч, судлаач, орон нутгийн иргэд болон бусад 
            хүмүүсийн Мазаалай хамгаалалтын ажилд оруулж буй хувь нэмрийг хүлээн зөвшөөрч, 
            тэмдэглэх зорилготой.
          </p>
          <p style={{ marginBottom: 'var(--space-md)' }}>
            NFC карт ашиглан хүмүүсийн хөнгөлөлт, хандив, сайн дурын ажил зэргийг бүртгэж, 
            тэднийг "Мазаалай баатрууд" гэж нэрлэж байна.
          </p>
          <div style={{ marginTop: 'var(--space-xl)', textAlign: 'center' }}>
            <Link to="/" className="btn">Leaderboard руу буцах</Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default AboutPage;

