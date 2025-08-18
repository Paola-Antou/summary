import { useEffect } from 'react';
import '../styles/AcademicAbstracts.css';

export default function AcademicAbstracts() {
  // Functions for PDF and Word generation
  const generatePDF = () => {
    // Add the required script files to the document
    const addScripts = async () => {
      // Create a promise to load jsPDF
      const loadJsPDF = new Promise<void>((resolve) => {
        if ((window as any).jspdf) {
          resolve();
          return;
        }
        
        const jsPDFScript = document.createElement('script');
        jsPDFScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
        jsPDFScript.onload = () => resolve();
        document.body.appendChild(jsPDFScript);
      });

      // Create a promise to load html2canvas
      const loadHtml2Canvas = new Promise<void>((resolve) => {
        if ((window as any).html2canvas) {
          resolve();
          return;
        }
        
        const html2canvasScript = document.createElement('script');
        html2canvasScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
        html2canvasScript.onload = () => resolve();
        document.body.appendChild(html2canvasScript);
      });

      // Wait for both scripts to load
      await Promise.all([loadJsPDF, loadHtml2Canvas]);
    };

    // Generate and download the PDF
    const createPDF = () => {
      try {
        const { jsPDF } = (window as any).jspdf;
        const doc = new jsPDF('p', 'mm', 'a4');
        const abstracts = document.querySelectorAll('.abstract');
        
        // Alert the user
        alert("Génération du PDF en cours... Cela peut prendre quelques secondes.");
        
        let currentPage = 1;
        let yPosition = 20;
        
        // Add title to document
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('Résumés Académiques pour le Colloque UAC', 105, 10, { align: 'center' });
        
        // For each abstract
        abstracts.forEach((abstract) => {
          // Get abstract elements
          const tag = abstract.querySelector('.tag')?.textContent || '';
          const title = abstract.querySelector('h2')?.textContent || '';
          const authors = abstract.querySelector('.authors')?.textContent || '';
          const content = abstract.querySelector('.abstract-content p:first-child')?.textContent?.replace('Résumé : ', '') || '';
          const keywords = abstract.querySelector('.abstract-content p:last-child')?.textContent || '';
          
          // If we're near the bottom of the page, create a new page
          if (yPosition > 250) {
            doc.addPage();
            currentPage++;
            yPosition = 20;
          }
          
          // Add tag
          doc.setFontSize(10);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(52, 152, 219);
          doc.text(tag, 20, yPosition);
          yPosition += 7;
          
          // Add title
          doc.setFontSize(14);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(0, 0, 0);
          
          // Split title if it's too long
          const titleLines = doc.splitTextToSize(title, 170);
          doc.text(titleLines, 20, yPosition);
          yPosition += titleLines.length * 7;
          
          // Add authors
          doc.setFontSize(11);
          doc.setFont('helvetica', 'italic');
          doc.text(authors, 20, yPosition);
          yPosition += 10;
          
          // Add content
          doc.setFontSize(11);
          doc.setFont('helvetica', 'normal');
          const contentLines = doc.splitTextToSize(content, 170);
          doc.text(contentLines, 20, yPosition);
          yPosition += contentLines.length * 5;
          
          // Add keywords
          doc.setFontSize(11);
          doc.setFont('helvetica', 'bold');
          doc.text(keywords, 20, yPosition);
          yPosition += 20;
        });
        
        // Add date in footer
        const date = new Date();
        doc.setFontSize(8);
        doc.setFont('helvetica', 'italic');
        doc.text(`Document généré le ${date.toLocaleDateString()}`, 20, 290);
        
        // Save PDF
        doc.save('Résumés_Académiques_UAC.pdf');
      } catch (error) {
        console.error("Erreur lors de la génération du PDF:", error);
        alert("Une erreur s'est produite lors de la génération du PDF. Veuillez réessayer.");
      }
    };

    // Execute the functions
    addScripts().then(createPDF);
  };

  const generateWord = () => {
    // Add the required script file to the document
    const addScript = async () => {
      return new Promise<void>((resolve) => {
        if ((window as any).docx) {
          resolve();
          return;
        }
        
        const docxScript = document.createElement('script');
        docxScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/docx/7.8.2/docx.js';
        docxScript.onload = () => resolve();
        document.body.appendChild(docxScript);
      });
    };

    // Generate and download the Word document
    const createWordDoc = () => {
      try {
        // Alert the user
        alert("Génération du document Word en cours...");
        
        const { Document, Paragraph, TextRun, AlignmentType, HeadingLevel, Packer } = (window as any).docx;
        
        // Create a new document
        const doc = new Document({
          sections: [{
            properties: {},
            children: [
              new Paragraph({
                text: 'Résumés Académiques pour le Colloque UAC',
                heading: HeadingLevel.HEADING_1,
                alignment: AlignmentType.CENTER,
              })
            ]
          }]
        });
        
        // For each abstract
        const abstracts = document.querySelectorAll('.abstract');
        abstracts.forEach((abstract) => {
          // Get abstract elements
          const tag = abstract.querySelector('.tag')?.textContent || '';
          const title = abstract.querySelector('h2')?.textContent || '';
          const authors = abstract.querySelector('.authors')?.textContent || '';
          const content = abstract.querySelector('.abstract-content p:first-child')?.textContent?.replace('Résumé : ', '') || '';
          const keywords = abstract.querySelector('.abstract-content p:last-child')?.textContent || '';
          
          // Add paragraphs to document
          doc.addSection({
            children: [
              new Paragraph({
                text: tag,
                style: 'tagStyle'
              }),
              new Paragraph({
                text: title,
                heading: HeadingLevel.HEADING_2
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: authors,
                    italics: true
                  })
                ]
              }),
              new Paragraph({
                text: ''  // Empty line
              }),
              new Paragraph({
                text: content
              }),
              new Paragraph({
                text: ''  // Empty line
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: keywords,
                    bold: true
                  })
                ]
              }),
              new Paragraph({
                text: ''  // Empty line
              }),
            ]
          });
        });
        
        // Generate and download Word document
        Packer.toBlob(doc).then((blob: Blob) => {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'Résumés_Académiques_UAC.docx';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        });
      } catch (error) {
        console.error("Erreur lors de la génération du document Word:", error);
        alert("Une erreur s'est produite lors de la génération du document Word. Veuillez réessayer.");
      }
    };

    // Execute the functions
    addScript().then(createWordDoc);
  };
  
  useEffect(() => {
    // Add hover effect for abstracts
    const abstracts = document.querySelectorAll('.abstract');
    abstracts.forEach(function(abstract) {
      abstract.addEventListener('mouseenter', function() {
        (this as HTMLElement).style.borderColor = '#3498db';
      });
      
      abstract.addEventListener('mouseleave', function() {
        (this as HTMLElement).style.borderColor = '#ddd';
      });
    });
  }, []);

  return (
    <div className="container">
      <header>
        <h1>Résumés Académiques pour Colloque UAC</h1>
        <p className="subtitle">Thématiques sur les Systèmes d'Information Décisionnels et Gouvernance Locale au Bénin</p>
      </header>
      
      <main>
        <section className="abstract" id="abstract1">
          <div className="abstract-header">
            <span className="tag">Gouvernance Numérique</span>
            <h2>Conception et Déploiement d'un Système d'Information Décisionnel pour l'Évaluation de la Maturité Numérique des Communes Béninoises (2016-2021)</h2>
          </div>
          <div className="abstract-content">
            <p><strong>Résumé :</strong> Cette recherche présente la conception et le développement d'un Système d'Information Décisionnel (SID) novateur destiné à l'évaluation et au suivi de la maturité numérique des communes béninoises. Face aux défis de la transformation digitale territoriale, notre étude propose une méthodologie structurée d'élaboration d'un tableau de bord interactif permettant aux décideurs locaux d'identifier les forces et faiblesses numériques de leurs territoires. Le système intègre une architecture modulaire s'appuyant sur des données historiques (2016-2021) couvrant les 77 communes du Bénin réparties dans 12 départements. Notre approche méthodologique inclut l'analyse multi-domaines des indicateurs de développement numérique, permettant une vision holistique de la transformation digitale locale. Cette étude s'appuie sur des données structurées couvrant plusieurs années, offrant ainsi une perspective temporelle précieuse pour comprendre les trajectoires de développement numérique des communes béninoises. Bien que récemment déployé et donc encore en phase d'adoption par les communes, ce SID constitue une innovation significative dans le paysage des outils d'aide à la décision pour la gouvernance territoriale au Bénin. Les tests préliminaires suggèrent que l'utilisation du système permet d'obtenir une vision synthétique et objective de la situation numérique communale, réduisant considérablement le temps de diagnostic territorial comparé aux méthodes traditionnelles d'évaluation.</p>
            
            <p><strong>Mots-clés :</strong> Gouvernance locale, Systèmes d'Information Décisionnels, Bénin, Transformation digitale, Communes</p>
          </div>
        </section>

        <section className="abstract" id="abstract2">
          <div className="abstract-header">
            <span className="tag">Intelligence Artificielle</span>
            <h2>Application de l'Algorithme K-Means pour la Classification des Communes Béninoises selon leur Profil de Développement Numérique</h2>
          </div>
          <div className="abstract-content">
            <p><strong>Résumé :</strong> Cette étude explore l'application de l'algorithme de clustering K-Means pour catégoriser les 77 communes béninoises selon leur profil de développement numérique, dans la perspective d'optimiser les politiques d'aménagement numérique du territoire. En s'appuyant sur les données collectées entre 2016 et 2021 via notre Système d'Information Décisionnel, cette recherche propose une approche méthodologique innovante pour l'analyse des disparités numériques territoriales. Notre étude identifie des indicateurs pertinents pour une classification efficace, organisés selon différents domaines thématiques, et applique spécifiquement l'algorithme K-Means, particulièrement adapté aux spécificités des données communales béninoises. L'analyse préliminaire des données existantes révèle des variations significatives entre les communes, particulièrement concernant l'accès aux infrastructures numériques et l'adoption des services digitaux. Nous proposons un cadre théorique pour l'établissement de typologies de communes : "numériquement avancées", "en transition numérique", "à potentiel inexploité", "structurellement limitées" et "numériquement marginalisées". Cette recherche établit les fondements méthodologiques nécessaires à une future analyse automatisée des profils numériques communaux basée sur K-Means, favorisant ainsi une meilleure adaptation des politiques publiques aux réalités territoriales et une allocation plus efficiente des ressources pour le développement numérique local au Bénin.</p>
            
            <p><strong>Mots-clés :</strong> Intelligence Artificielle, K-Means, Clustering, Gouvernance locale, Communes béninoises, Développement numérique</p>
          </div>
        </section>

        <section className="abstract" id="abstract3">
          <div className="abstract-header">
            <span className="tag">Analyse Prédictive</span>
            <h2>Application de la Régression Linéaire pour la Prédiction des Trajectoires Numériques des Communes Béninoises</h2>
          </div>
          <div className="abstract-content">
            <p><strong>Résumé :</strong> Cette recherche examine l'application de la régression linéaire au sein du Système d'Information Décisionnel (SID) pour la prédiction et l'anticipation des trajectoires de développement numérique des communes béninoises. En nous appuyant sur sept années de données historiques (2016-2021) couvrant les 77 communes du Bénin, nous proposons un cadre conceptuel pour l'implémentation de modèles de régression linéaire capables d'anticiper l'évolution des indicateurs clés de digitalisation territoriale. Notre étude identifie les prérequis méthodologiques et techniques pour la mise en œuvre de cette approche prédictive, ainsi que les défis spécifiques au contexte béninois, tels que l'hétérogénéité des niveaux de développement numérique entre départements et les particularités socio-économiques locales influençant les trajectoires numériques. Une analyse préliminaire des tendances observées dans les séries temporelles existantes suggère des patterns de développement numérique distincts selon les régions et la taille des communes, particulièrement adaptés à une modélisation par régression linéaire. Des simulations théoriques basées sur les données disponibles indiquent que cette approche prédictive pourrait potentiellement atteindre des niveaux de précision satisfaisants pour des projections à court terme, tout en offrant l'avantage d'une interprétabilité facilitée pour les décideurs locaux. Cette recherche pose les jalons conceptuels pour le développement d'un module d'analyse prédictive basé sur la régression linéaire au sein du SID, contribuant ainsi à l'évolution des pratiques de planification stratégique numérique au niveau communal au Bénin.</p>
            
            <p><strong>Mots-clés :</strong> Analyse prédictive, Régression linéaire, Gouvernance locale, Planification stratégique, Communes béninoises</p>
          </div>
        </section>

        <div className="download-section">
          <h3>Télécharger les résumés</h3>
          <button onClick={generatePDF}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            Format PDF
          </button>
          <button onClick={generateWord}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            Format Word
          </button>
        </div>
      </main>
      
      <footer>
        <p>Préparé pour le Colloque de l'Université d'Abomey-Calavi | 2025</p>
      </footer>
    </div>
  );
}

// Add TypeScript definitions for docx and jspdf
declare global {
  interface Window {
    docx: any;
    jspdf: {
      jsPDF: any;
    };
  }
}
