import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { useScrollAnimation } from '../utils/useScrollAnimation';
import { getIndustryImage } from '../utils/industryImages';

function getInitial(text) {
  if (!text) return '?';
  const trimmed = text.trim();
  return trimmed ? trimmed.charAt(0).toUpperCase() : '?';
}

function DiamondIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path d="M7.4 3h9.2l4.3 5.4-9 12.6-9-12.6L7.4 3z" />
    </svg>
  );
}

function TrophyIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path d="M7 4v2h10V4h2a1 1 0 0 1 1 1v2a5 5 0 0 1-4 4.9A4 4 0 0 1 13 15v1h3v2H8v-2h3v-1a4 4 0 0 1-3.98-3.1A5 5 0 0 1 4 7V5a1 1 0 0 1 1-1h2Zm11 3V6h-1v1a3 3 0 0 0 2 2.83V7ZM6 7a3 3 0 0 0 2-2.83V6H7v1Z" />
    </svg>
  );
}

function HomePage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadLeaderboard = useCallback(async () => {
    try {
      const data = await api.getLeaderboard();
      setRows(Array.isArray(data.rows) ? data.rows : []);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLeaderboard();
    const leaderboardInterval = setInterval(loadLeaderboard, 5000);

    return () => {
      clearInterval(leaderboardInterval);
    };
  }, [loadLeaderboard]);

  const [heroRef, heroVisible] = useScrollAnimation({ threshold: 0.1 });
  const [podiumRef, podiumVisible] = useScrollAnimation({ threshold: 0.1 });
  const [tableRef, tableVisible] = useScrollAnimation({ threshold: 0.1 });

  const formatter = useMemo(() => new Intl.NumberFormat('en-US'), []);
  const topNine = useMemo(() => rows.slice(0, 9), [rows]);
  const others = useMemo(() => rows.slice(9), [rows]);
  const totalPlayers = rows.length;
  const isEmpty = !loading && totalPlayers === 0;

  // 3D Carousel state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const carouselRef = useRef(null);
  const animationRef = useRef(null);

  // Carousel navigation
  const goToSlide = useCallback((index) => {
    setCurrentIndex(index);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % topNine.length);
  }, [topNine.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + topNine.length) % topNine.length);
  }, [topNine.length]);

  // Drag handlers
  const handleDragStart = useCallback((e) => {
    setIsDragging(true);
    setStartX(e.type === 'mousedown' ? e.clientX : e.touches[0].clientX);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  }, []);

  const handleDragMove = useCallback((e) => {
    if (!isDragging) return;
    const currentX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
    const diff = currentX - startX;
    setDragOffset(diff);
  }, [isDragging, startX]);

  const handleDragEnd = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);

    if (Math.abs(dragOffset) > 80) {
      if (dragOffset > 0) {
        prevSlide();
      } else {
        nextSlide();
      }
    }

    setDragOffset(0);
  }, [isDragging, dragOffset, nextSlide, prevSlide]);

  // Auto-rotate carousel
  useEffect(() => {
    if (topNine.length === 0) return;
    
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [nextSlide, topNine.length]);

  const renderAvatar = (row, size = 'lg') => {
    const baseClass = `hp-avatar ${size}`;
    const avatarImg = row?.industry ? getIndustryImage(row.industry) : null;
    
    if (row && avatarImg) {
      return (
        <div className={baseClass}>
          <img
            src={avatarImg}
            alt={row.label ? `${row.label} avatar` : 'Player avatar'}
          />
        </div>
      );
    }

    const initial = getInitial(row?.label || row?.name);
    return (
      <div className={`${baseClass} fallback`}>
        <span>{initial}</span>
      </div>
    );
  };

  const makeHandle = (row) => {
    if (!row) return '@player';
    if (row.nickname) {
      return `@${row.nickname.replace(/\s+/g, '').toLowerCase()}`;
    }
    if (row.name) {
      return `@${row.name.replace(/\s+/g, '').toLowerCase()}`;
    }
    return `@player${row.id}`;
  };

  return (
    <div className="homepage">
      <section
        ref={heroRef}
        className={`hp-hero scroll-animated ${heroVisible ? 'visible' : ''}`}
      >
          <div className="hp-hero-content">
            <h1>Мазаалай баатрууд</h1>
            <p>
              Байгаль, зэрлэг амьтны төлөө тууштай зүтгэж буй хүмүүсийн амьд
              жагсаалт. Энэхүү систем нь{' '}
              <strong>Говийн эзэн Мазаалай</strong> болон Монголын байгалийг
              хамгаалах баатруудын бодит хувь нэмрийг тэмдэглэнэ.
            </p>
          </div>
          <div className="hp-hero-cta">
            <Link to="/about" className="hp-hero-button">
              Мазаалай тухай дэлгэрэнгүй
            </Link>
          </div>
        </section>

        <section
          ref={podiumRef}
          className={`hp-carousel-3d scroll-animated ${podiumVisible ? 'visible' : ''}`}
        >
          <div 
            className="hp-carousel-stage"
            ref={carouselRef}
            onMouseDown={handleDragStart}
            onMouseMove={handleDragMove}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onTouchStart={handleDragStart}
            onTouchMove={handleDragMove}
            onTouchEnd={handleDragEnd}
          >
            <div className="hp-carousel-track">
              {topNine.map((row, index) => {
                // Calculate circular position
                const totalCards = topNine.length;
                const angleStep = 360 / totalCards;
                const angle = ((index - currentIndex) * angleStep + 360) % 360;
                
                // Normalize angle to -180 to 180 range for better calculations
                const normalizedAngle = angle > 180 ? angle - 360 : angle;
                const absAngle = Math.abs(normalizedAngle);
                
                const isActive = absAngle < angleStep / 2;
                
                // Calculate 3D position in circular pattern
                const radius = 650;
                const angleRad = (normalizedAngle * Math.PI) / 180;
                const translateX = Math.sin(angleRad) * radius;
                const translateZ = Math.cos(angleRad) * radius - radius + (isActive ? 200 : -50);
                const rotateY = normalizedAngle;
                
                // Scale and opacity based on angle
                const scale = isActive ? 1 : Math.max(0.6, 1 - (absAngle / 180) * 0.4);
                const opacity = isActive ? 1 : Math.max(0.2, 1 - (absAngle / 180) * 0.8);
                const blur = isActive ? 0 : Math.min(5, (absAngle / 50) * 2.5);

                const Wrapper = row ? Link : 'div';
                const wrapperProps = row ? { to: `/u/${row.id}` } : {};
                const points = row ? formatter.format(row.total || 0) : '0';

                const getTrophyClass = (position) => {
                  if (position === 1) return 'first';
                  if (position === 2) return 'second';
                  if (position === 3) return 'third';
                  return 'other';
                };

                return (
                  <Wrapper
                    key={row?.id || index}
                    className={`hp-carousel-card-3d ${isActive ? 'active' : ''} ${!row ? 'empty' : ''}`}
                    style={{
                      transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                      opacity,
                      filter: `blur(${blur}px)`,
                      zIndex: isActive ? 100 : Math.round(50 - absAngle),
                      pointerEvents: absAngle > 120 ? 'none' : 'auto',
                    }}
                    onClick={(e) => {
                      if (!isActive && row) {
                        e.preventDefault();
                        goToSlide(index);
                      }
                    }}
                    {...wrapperProps}
                  >
                    <div className="hp-carousel-card-glow"></div>
                    <div className="hp-carousel-card-content">
                      <div className="hp-carousel-rank-badge">
                        <div className={`hp-carousel-trophy ${getTrophyClass(index + 1)}`}>
                          <TrophyIcon className="hp-trophy" />
                        </div>
                        <span className="hp-carousel-rank-number">#{index + 1}</span>
                      </div>
                      
                      <div className="hp-carousel-avatar-container">
                        {renderAvatar(row, 'xl')}
                      </div>
                      
                      <div className="hp-carousel-info">
                        <h3 className="hp-carousel-name">
                          {row?.label || 'Awaiting hero'}
                        </h3>
                        <p className="hp-carousel-role">
                          {row?.profession || 'Мэргэжил бүртгэгдээгүй'}
                        </p>
                      </div>
                      
                      <div className="hp-carousel-score">
                        <DiamondIcon className="hp-carousel-gem" />
                        <span className="hp-carousel-points">{points}</span>
                      </div>
                    </div>
                  </Wrapper>
                );
              })}
            </div>
          </div>

          <div className="hp-carousel-controls">
            <button 
              className="hp-carousel-btn hp-carousel-btn-prev"
              onClick={prevSlide}
              disabled={topNine.length === 0}
              aria-label="Previous hero"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
              </svg>
            </button>
            
            <div className="hp-carousel-dots">
              {topNine.map((_, index) => (
                <button
                  key={index}
                  className={`hp-carousel-dot ${index === currentIndex ? 'active' : ''}`}
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to hero ${index + 1}`}
                />
              ))}
            </div>
            
            <button 
              className="hp-carousel-btn hp-carousel-btn-next"
              onClick={nextSlide}
              disabled={topNine.length === 0}
              aria-label="Next hero"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
              </svg>
            </button>
          </div>
        </section>

        {/* <div className="hp-info-banner">
          Энд бүртгэлтэй хүмүүс бол Говийн эзэн Мазаалай болон Монголын
          байгалийг хамгаалах бодит баатрууд.
        </div> */}

        <section
          ref={tableRef}
          className={`hp-table-section scroll-animated ${tableVisible ? 'visible' : ''}`}
        >


          <div className="hp-table-new">
            <div className="hp-table-row-new head">
              <span className="hp-table-col-rank">Rank</span>
              <span className="hp-table-col-user">User</span>
              <span className="hp-table-col-profession">Мэргэжил</span>
              <span className="hp-table-col-points">Point</span>
            </div>

            {loading && (
              <>
                <div className="hp-table-row-new skeleton">
                  <div className="hp-table-col-rank" />
                  <div className="hp-table-col-user" />
                  <div className="hp-table-col-profession" />
                  <div className="hp-table-col-points" />
                </div>
                <div className="hp-table-row-new skeleton">
                  <div className="hp-table-col-rank" />
                  <div className="hp-table-col-user" />
                  <div className="hp-table-col-profession" />
                  <div className="hp-table-col-points" />
                </div>
              </>
            )}

            {!loading && isEmpty && (
              <div className="hp-table-empty">
                Эхний NFC гүйлгээг хийхэд leaderboard автоматаар гарч ирнэ.
              </div>
            )}

            {!loading &&
              !isEmpty &&
              others.map((row, idx) => {
                const rank = idx + 10;
                const handle = makeHandle(row);
                return (
                  <Link
                    key={row.id}
                    to={`/u/${row.id}`}
                    className="hp-table-row-new"
                  >
                    <div className="hp-table-col-rank">
                      <span className="hp-table-rank-pill">#{rank}</span>
                    </div>
                    <div className="hp-table-col-user">
                      <div className="hp-table-user-new">
                        {renderAvatar(row, 'table')}
                        <div className="hp-table-user-info-new">
                          <span className="hp-table-name-new">{row.label}</span>
                          <span className="hp-table-handle-new">{handle}</span>
                          {/* <div className="hp-table-profession-mobile-new">
                            {row.profession || '—'}
                          </div> */}
                        </div>
                      </div>
                    </div>
                    <div className="hp-table-col-profession">
                      <span className="hp-table-profession-new">{row.profession || '—'}</span>
                    </div>
                    <div className="hp-table-col-points">
                      <div className="hp-table-points-badge">
                        <span className="hp-table-points-icon">
                          <DiamondIcon className="hp-diamond-badge" />
                        </span>
                        <span className="hp-table-points-value-new">{formatter.format(row.total || 0)}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}

            {!loading && !isEmpty && others.length === 0 && (
              <div className="hp-table-empty subtle">
                Одоогоор эхний 9 баатар л бүртгэлтэй байна.
              </div>
            )}
          </div>
        </section>
    </div>
  );
}

export default HomePage;
