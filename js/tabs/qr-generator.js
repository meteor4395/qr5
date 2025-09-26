// QR Generator tab functionality
class QRGeneratorPage {
    constructor() {
        this.template = null;
        this.contentDiv = null;
        this.qrData = null;
    }

    async initialize(contentDiv) {
        this.contentDiv = contentDiv;
        await this.loadTemplate();
        this.render();
        this.attachEventListeners();
    }

    async loadTemplate() {
        try {
            const response = await fetch('templates/qr-generator.html');
            this.template = await response.text();
        } catch (error) {
            console.error('Error loading QR generator template:', error);
            throw error;
        }
    }

    render() {
        if (!this.template || !this.contentDiv) return;
        this.contentDiv.innerHTML = this.template;
    }

    attachEventListeners() {
        const form = document.getElementById('qrForm');
        if (form) {
            form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }

        const downloadBtn = document.getElementById('downloadPdf');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => this.handlePdfDownload());
        }
    }

    async handleFormSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        
        // Generate unique ID
        const qrId = 'ID-' + Math.random().toString(36).substr(2, 9).toUpperCase();
        
        // Collect form data
        this.qrData = {
            id: qrId,
            vendorName: formData.get('vendorName'),
            lotNumber: formData.get('lotNumber'),
            itemType: formData.get('itemType'),
            manufactureDate: formData.get('manufactureDate'),
            supplyDate: formData.get('supplyDate'),
            warrantyPeriod: formData.get('warrantyPeriod')
        };

        await this.generateQRCode();
        this.showQRInfo();
    }

    async generateQRCode() {
        const qrDiv = document.getElementById('qrCode');
        if (!qrDiv || !this.qrData) return;

        const qrDataString = JSON.stringify(this.qrData);
        const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrDataString)}`;
        
        // Create and show QR code image
        qrDiv.innerHTML = `<img src="${qrImageUrl}" alt="Generated QR Code">`;
    }

    showQRInfo() {
        if (!this.qrData) return;

        const qrInfo = document.getElementById('qrInfo');
        const qrId = document.getElementById('qrId');
        
        if (qrInfo && qrId) {
            qrInfo.classList.remove('hidden');
            qrId.textContent = this.qrData.id;
        }
    }

    async handlePdfDownload() {
        if (!this.qrData) return;

        try {
            // TODO: Implement proper PDF generation
            const pdfContent = this.generatePdfContent();
            this.downloadPdf(pdfContent);
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Error generating PDF. Please try again.');
        }
    }

    generatePdfContent() {
        // TODO: Implement actual PDF generation logic
        // For now, just show an alert
        alert('PDF download feature coming soon!');
    }

    downloadPdf(content) {
        // TODO: Implement actual PDF download
        console.log('PDF content ready for download:', content);
    }
}

// Create and export the page instance
const qrGeneratorPage = new QRGeneratorPage();
export const loadQRGeneratorPage = async (contentDiv) => {
    try {
        await qrGeneratorPage.initialize(contentDiv);
    } catch (error) {
        console.error('Error loading QR generator page:', error);
        contentDiv.innerHTML = '<p class="text-red-500">Error loading content</p>';
    }
};