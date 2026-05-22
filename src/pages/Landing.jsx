// src/pages/Landing.jsx
// Page d'accueil publique (visible avant connexion)
import React from 'react';
import { motion } from 'framer-motion';
import { Users, MapPin, Mail, Calendar, Sparkles } from 'lucide-react';
import '../styles/pages/Landing.css';

export default function Landing({ onLoginClick }) {
  return (
    <div className="landing">
      {/* HERO */}
      <header className="landing-hero">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <img
            src="/logo512.png"
            alt="ALADJ - À l'assaut des jeux"
            className="hero-logo"
          />
          <p className="hero-tagline">
            L'association des passionné·e·s de jeux de société du Coutançais.
          </p>
          <p className="hero-sub">
            Ado, adulte, débutant ou tacticien aguerri — viens partager des bons moments
            autour d'une table, dans une ambiance conviviale et bienveillante.
          </p>
          <button className="hero-cta" onClick={onLoginClick}>
            Rejoindre l'asso →
          </button>
        </motion.div>
      </header>

      {/* QUICK FACTS */}
      <section className="landing-section facts">
        <div className="fact-card fact-navy">
          <MapPin size={28} />
          <h3>Où ?</h3>
          <p>Plusieurs villages du Coutançais. Les lieux changent selon les soirées.</p>
        </div>
        <div className="fact-card fact-teal">
          <Calendar size={28} />
          <h3>Quand ?</h3>
          <p>Soirées annoncées au fil de l'eau. Inscris-toi pour ne rien rater.</p>
        </div>
        <div className="fact-card fact-yellow">
          <Users size={28} />
          <h3>Pour qui ?</h3>
          <p>Ados et adultes, débutants comme confirmés. La diversité fait le sel des parties.</p>
        </div>
        <div className="fact-card fact-purple">
          <Sparkles size={28} />
          <h3>Adhésion</h3>
          <p>Adhésion libre, par dons. On reste une association sans but lucratif.</p>
        </div>
      </section>

      {/* WHAT WE DO */}
      <section className="landing-section about">
        <h2>Ce qu'on fait</h2>
        <div className="about-grid">
          <div className="about-item">
            <span className="about-icon">🃏</span>
            <h3>Des parties variées</h3>
            <p>
              Stratégie, deckbuilding, party games, enquêtes, narratif, ambiance…
              Quel que soit ton style de jeu favori, tu trouveras une table.
            </p>
          </div>
          <div className="about-item">
            <span className="about-icon">📚</span>
            <h3>Un catalogue partagé</h3>
            <p>
              Découvre les jeux apportés par les membres, filtre par mécanique
              ou par nombre de joueurs, et ajoute tes coups de cœur.
            </p>
          </div>
          <div className="about-item">
            <span className="about-icon">📅</span>
            <h3>Des soirées annoncées</h3>
            <p>
              Soirées chez l'un·e ou l'autre, événements ponctuels, parties à thème :
              tout est annoncé via la plateforme, tu choisis ce qui te plaît.
            </p>
          </div>
          <div className="about-item">
            <span className="about-icon">🤝</span>
            <h3>Un esprit convivial</h3>
            <p>
              Pas de compétition, pas de pression. On joue pour le plaisir
              et pour rencontrer du monde dans la région.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="landing-section cta">
        <h2>Envie de jouer avec nous ?</h2>
        <p>
          Crée ton compte en 30 secondes pour voir le catalogue des jeux,
          les soirées à venir, et participer aux prochaines parties.
        </p>
        <button className="hero-cta" onClick={onLoginClick}>
          Créer mon compte →
        </button>
      </section>

      {/* FOOTER */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <img src="/logo-mark-80.png" alt="ALADJ" />
            <div>
              <strong>À l'assaut des jeux</strong>
              <p>Association loi 1901 — Coutançais, Manche (50)</p>
            </div>
          </div>
          <div className="footer-contact">
            <Mail size={16} />
            <a href="mailto:contact@assaut-des-jeux.fr">contact@assaut-des-jeux.fr</a>
          </div>
        </div>
        <div className="footer-bottom">
          <small>© {new Date().getFullYear()} À l'assaut des jeux — ALADJ</small>
        </div>
      </footer>
    </div>
  );
}
