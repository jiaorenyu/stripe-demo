import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  width: 100%;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Title = styled.div`
  color: white;
`;

const MainTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  opacity: 0.9;
  font-weight: 300;
`;

const LanguageSelector = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const LanguageLabel = styled.span`
  color: white;
  font-weight: 500;
`;

const LanguageButton = styled.button<{ active?: boolean }>`
  background: ${props => props.active ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)'};
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-1px);
  }
`;

const LanguageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
`;

interface Language {
  code: string;
  name: string;
}

const languages: Language[] = [
  { code: 'en', name: 'English' },
  { code: 'zh', name: '中文' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' }
];

const Header: React.FC = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
  };

  return (
    <HeaderContainer>
      <HeaderContent>
        <Title>
          <MainTitle>{t('app.title')}</MainTitle>
          <Subtitle>{t('app.subtitle')}</Subtitle>
        </Title>
        
        <LanguageSelector>
          <LanguageLabel>{t('language.switch')}</LanguageLabel>
          <LanguageGrid>
            {languages.map((lang) => (
              <LanguageButton
                key={lang.code}
                active={i18n.language === lang.code}
                onClick={() => changeLanguage(lang.code)}
              >
                {lang.name}
              </LanguageButton>
            ))}
          </LanguageGrid>
        </LanguageSelector>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header; 