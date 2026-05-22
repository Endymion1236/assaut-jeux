// src/pages/About.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Mail, Users, Calendar, Heart, Shield } from 'lucide-react';
import '../styles/pages/About.css';

export default function About() {
  return (
    <motion.div
      className="about-page"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* === HERO === */}
      <header className="about-hero">
        <img src="/logo-mark-128.png" alt="ALADJ" className="about-logo" />
        <h1>À propos de l'asso</h1>
        <p className="about-tagline">
          <strong>À l'assaut des jeux</strong> — la communauté des passionné·e·s
          de jeux de société du Coutançais.
        </p>
      </header>

      {/* === QUI SOMMES-NOUS === */}
      <section className="about-section">
        <h2>🎲 Qui sommes-nous ?</h2>
        <p>
          ALADJ est une association loi 1901 basée dans le Coutançais (Manche, Normandie).
          Nous rassemblons des joueurs et joueuses de tous âges et de tous niveaux
          autour d'une passion commune : les jeux de société modernes.
        </p>
        <p>
          Que tu sois fan de gros jeux de stratégie, de party games qui font crier,
          de coopératifs qui font réfléchir ou de jeux narratifs immersifs —
          tu trouveras forcément des partenaires de jeu à ta hauteur.
        </p>
      </section>

      {/* === CE QU'ON FAIT === */}
      <section className="about-section">
        <h2>📅 Nos activités</h2>
        <div className="activity-grid">
          <div className="activity-card">
            <Calendar size={28} />
            <h3>Soirées jeux</h3>
            <p>
              Organisées chez l'un·e ou l'autre, dans plusieurs villages du Coutançais.
              Annoncées au fil de l'eau sur la plateforme — inscris-toi pour participer.
            </p>
          </div>
          <div className="activity-card">
            <Users size={28} />
            <h3>Découvertes</h3>
            <p>
              On amène nos jeux, on les fait découvrir, on apprend les règles ensemble.
              Pas besoin de connaître pour venir — l'envie suffit.
            </p>
          </div>
          <div className="activity-card">
            <Heart size={28} />
            <h3>Convivialité</h3>
            <p>
              Pas de compétition, pas de pression. On joue pour le plaisir
              et pour rencontrer du monde dans la région.
            </p>
          </div>
          <div className="activity-card">
            <Shield size={28} />
            <h3>Bienveillance</h3>
            <p>
              Tous âges (ados+), tous niveaux, tous genres bienvenus.
              On veille à ce que personne ne se sente exclu d'une table.
            </p>
          </div>
        </div>
      </section>

      {/* === CONTACT === */}
      <section className="about-section about-contact">
        <h2>📬 Nous contacter</h2>
        <div className="contact-grid">
          <div className="contact-card">
            <Mail size={22} />
            <div>
              <strong>Par email</strong>
              <a href="mailto:contact@assaut-des-jeux.fr">contact@assaut-des-jeux.fr</a>
            </div>
          </div>
          <div className="contact-card">
            <MapPin size={22} />
            <div>
              <strong>Où nous trouver</strong>
              <p>Coutançais, Manche (50), Normandie</p>
            </div>
          </div>
        </div>
      </section>

      {/* === MENTIONS LÉGALES === */}
      <section className="about-section about-legal">
        <h2>⚖️ Mentions légales</h2>

        <h3>Éditeur du site</h3>
        <p>
          <strong>À l'assaut des jeux</strong> — Association loi 1901<br />
          Coutançais, Manche (50), France<br />
          Contact : <a href="mailto:contact@assaut-des-jeux.fr">contact@assaut-des-jeux.fr</a>
        </p>

        <h3>Hébergement</h3>
        <p>
          Site hébergé par Vercel Inc.<br />
          340 S Lemon Ave #4133, Walnut, CA 91789, USA<br />
          <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">vercel.com</a>
        </p>

        <h3>Données personnelles (RGPD)</h3>
        <p>
          Nous collectons uniquement les données nécessaires au fonctionnement de la plateforme :
          email, pseudo, préférences de jeux, et inscriptions aux soirées.
          Ces données sont stockées chez Google (Firebase Authentication & Firestore).
        </p>
        <p>
          Conformément au RGPD, tu disposes d'un droit d'accès, de rectification,
          de portabilité et de suppression de tes données. Pour exercer ces droits,
          écris-nous à <a href="mailto:contact@assaut-des-jeux.fr">contact@assaut-des-jeux.fr</a>.
        </p>

        <h3>Cookies</h3>
        <p>
          Le site utilise uniquement des cookies techniques nécessaires à l'authentification.
          Aucun cookie de tracking ni de publicité n'est déposé.
        </p>

        <h3>Crédits</h3>
        <p>
          Les données de jeux proviennent de
          <a href="https://boardgamegeek.com" target="_blank" rel="noopener noreferrer"> BoardGameGeek</a>,
          utilisées dans le cadre de leur API XML.
        </p>
      </section>

      <footer className="about-footer">
        <small>© {new Date().getFullYear()} À l'assaut des jeux — ALADJ</small>
      </footer>
    </motion.div>
  );
}
