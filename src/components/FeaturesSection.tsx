import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const FeaturesContainer = styled.section`
  max-width: 1000px;
  width: 100%;
`;

const FeaturesTitle = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 3rem;
  color: white;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const FeatureCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  }
`;

const FeatureIcon = styled.div`
  width: 60px;
  height: 60px;
  margin: 0 auto 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #333;
`;

const FeatureDescription = styled.p`
  color: #666;
  line-height: 1.6;
`;

const FeaturesSection: React.FC = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: '💰',
      title: t('features.multiCurrency'),
      description: t('features.multiCurrencyDesc')
    },
    {
      icon: '🌍',
      title: t('features.multiLanguage'),
      description: t('features.multiLanguageDesc')
    },
    {
      icon: '🔒',
      title: t('features.secure'),
      description: t('features.secureDesc')
    }
  ];

  return (
    <FeaturesContainer>
      <FeaturesTitle>{t('features.title')}</FeaturesTitle>
      <FeaturesGrid>
        {features.map((feature, index) => (
          <FeatureCard key={index}>
            <FeatureIcon>{feature.icon}</FeatureIcon>
            <FeatureTitle>{feature.title}</FeatureTitle>
            <FeatureDescription>{feature.description}</FeatureDescription>
          </FeatureCard>
        ))}
      </FeaturesGrid>
    </FeaturesContainer>
  );
};

export default FeaturesSection; 