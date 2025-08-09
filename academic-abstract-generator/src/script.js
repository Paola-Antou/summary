document.addEventListener('DOMContentLoaded', function() {
    // Fonction pour le téléchargement PDF
    document.getElementById('downloadPdf').addEventListener('click', function() {
        generatePDF();
    });

    // Fonction pour le téléchargement Word (DOCX)
    document.getElementById('downloadWord').addEventListener('click', function() {
        generateWord();
    });

    // Ajouter un effet de survol pour chaque résumé
    const abstracts = document.querySelectorAll('.abstract');
    abstracts.forEach(function(abstract) {
        abstract.addEventListener('mouseenter', function() {
            this.style.borderColor = '#3498db';
        });
        
        abstract.addEventListener('mouseleave', function() {
            this.style.borderColor = '#ddd';
        });
    });
});

// Fonction pour générer un PDF
function generatePDF() {
    // Charger dynamiquement jsPDF
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    document.body.appendChild(script);

    // Charger html2canvas
    const html2canvasScript = document.createElement('script');
    html2canvasScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
    document.body.appendChild(html2canvasScript);

    html2canvasScript.onload = function() {
        script.onload = function() {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF('p', 'mm', 'a4');
            const abstracts = document.querySelectorAll('.abstract');
            
            // On indique qu'on génère le PDF
            alert("Génération du PDF en cours... Cela peut prendre quelques secondes.");
            
            let currentPage = 1;
            let yPosition = 20;
            
            // Ajouter le titre au document
            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            doc.text('Résumés Académiques pour le Colloque UAC', 105, 10, { align: 'center' });
            
            // Pour chaque résumé
            abstracts.forEach((abstract, index) => {
                // Récupérer les éléments du résumé
                const tag = abstract.querySelector('.tag').textContent;
                const title = abstract.querySelector('h2').textContent;
                const authors = abstract.querySelector('.authors').textContent;
                const content = abstract.querySelector('.abstract-content p:first-child').textContent.replace('Résumé : ', '');
                const keywords = abstract.querySelector('.abstract-content p:last-child').textContent;
                
                // Si on arrive en bas de page, on crée une nouvelle page
                if (yPosition > 250) {
                    doc.addPage();
                    currentPage++;
                    yPosition = 20;
                }
                
                // Ajouter le tag
                doc.setFontSize(10);
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(52, 152, 219);
                doc.text(tag, 20, yPosition);
                yPosition += 7;
                
                // Ajouter le titre
                doc.setFontSize(14);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(0, 0, 0);
                
                // Découper le titre s'il est trop long
                const titleLines = doc.splitTextToSize(title, 170);
                doc.text(titleLines, 20, yPosition);
                yPosition += titleLines.length * 7;
                
                // Ajouter les auteurs
                doc.setFontSize(11);
                doc.setFont('helvetica', 'italic');
                doc.text(authors, 20, yPosition);
                yPosition += 10;
                
                // Ajouter le contenu
                doc.setFontSize(11);
                doc.setFont('helvetica', 'normal');
                const contentLines = doc.splitTextToSize(content, 170);
                doc.text(contentLines, 20, yPosition);
                yPosition += contentLines.length * 5;
                
                // Ajouter les mots-clés
                doc.setFontSize(11);
                doc.setFont('helvetica', 'bold');
                doc.text(keywords, 20, yPosition);
                yPosition += 20;
            });
            
            // Ajouter la date en pied de page
            const date = new Date();
            doc.setFontSize(8);
            doc.setFont('helvetica', 'italic');
            doc.text(`Document généré le ${date.toLocaleDateString()}`, 20, 290);
            
            // Sauvegarder le PDF
            doc.save('Résumés_Académiques_UAC.pdf');
        };
    };
}

// Fonction pour générer un document Word
function generateWord() {
    // Charger dynamiquement docx.js
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/docx/7.8.2/docx.js';
    document.body.appendChild(script);
    
    script.onload = function() {
        // On indique qu'on génère le fichier Word
        alert("Génération du document Word en cours...");
        
        const { Document, Paragraph, TextRun, AlignmentType, HeadingLevel, Packer } = window.docx;
        
        // Créer un nouveau document
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
        
        // Pour chaque résumé
        const abstracts = document.querySelectorAll('.abstract');
        abstracts.forEach((abstract) => {
            // Récupérer les éléments du résumé
            const tag = abstract.querySelector('.tag').textContent;
            const title = abstract.querySelector('h2').textContent;
            const authors = abstract.querySelector('.authors').textContent;
            const content = abstract.querySelector('.abstract-content p:first-child').textContent.replace('Résumé : ', '');
            const keywords = abstract.querySelector('.abstract-content p:last-child').textContent;
            
            // Ajouter des paragraphes au document
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
                        text: ''  // Ligne vide
                    }),
                    new Paragraph({
                        text: content
                    }),
                    new Paragraph({
                        text: ''  // Ligne vide
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
                        text: ''  // Ligne vide
                    }),
                ]
            });
        });
        
        // Générer et télécharger le document Word
        Packer.toBlob(doc).then(blob => {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'Résumés_Académiques_UAC.docx';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    };
}