import React, { useEffect } from 'react';
import './AdBanner.css';

interface AdBannerProps {
  adClient?: string;
  adSlot?: string;
  adFormat?: 'auto' | 'horizontal' | 'rectangle' | 'vertical';
  responsive?: boolean;
}

const AdBanner: React.FC<AdBannerProps> = ({
  adClient,
  adSlot,
  adFormat = 'auto',
  responsive = true,
}) => {
  useEffect(() => {
    if (adClient) {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (err) {
        console.error('Erro ao carregar AdSense:', err);
      }
    }
  }, [adClient, adSlot]);

  if (!adClient) {
    return (
      <div className="ad-banner-container">
        <div className="ad-banner-placeholder">
          <span className="ad-placeholder-text">Espaço Publicitário</span>
          <span className="ad-placeholder-subtext">Aguardando aprovação do Google AdSense</span>
        </div>
      </div>
    );
  }

  return (
    <div className="ad-banner-container">
      <ins
        className="adsbygoogle ad-banner"
        style={{ display: 'block' }}
        data-ad-client={adClient}
        {...(adSlot && { 'data-ad-slot': adSlot })}
        data-ad-format={adFormat}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
      <div className="ad-banner-fallback">
        <span className="ad-fallback-text">Anúncio - 728x90</span>
      </div>
    </div>
  );
};

export default AdBanner;
