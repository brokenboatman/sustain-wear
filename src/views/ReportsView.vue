<script lang="ts" setup>
import { ref } from "vue";
import ReportsCO2Chart from "@/components/ReportsCO2Chart.vue";
import ReportsDonationChart from "@/Components/ReportsDonationChart.vue";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const co2 = ref<any>(null);
const donation = ref<any>(null);

const exportPdf = async () => {
  const now = new Date();
  const filename = `reports-${now.toISOString().slice(0,10)}.pdf`;
  const doc = new jsPDF('p','mm','a4');
  // Try using chart image exports first (Chart.js toBase64Image via component expose)
  const pages: string[] = [];

  try {
    const co2Export = co2.value?.exportImage?.();
    if (co2Export?.img) pages.push(co2Export.img);
  } catch (e) {
    console.warn('co2 exportImage failed', e);
  }

  try {
    const donationExport = donation.value?.exportImage?.();
    if (donationExport?.img) pages.push(donationExport.img);
  } catch (e) {
    console.warn('donation exportImage failed', e);
  }

  // For any charts not available via exportImage, fall back to html2canvas capture
  const fallbacks = [
    { id: 'reports-co2-root', imgIncluded: !!pages[0] },
    { id: 'reports-donation-root', imgIncluded: !!pages[1] },
  ];

  for (let i = 0; i < fallbacks.length; i++) {
    if (!fallbacks[i].imgIncluded) {
      const el = document.getElementById(fallbacks[i].id);
      if (!el) {
        console.warn(`${fallbacks[i].id} not found, skipping`);
        continue;
      }
      try {
        const canvas = await html2canvas(el, { scale: 2, useCORS: true });
        pages[i] = canvas.toDataURL('image/png');
      } catch (e) {
        console.error('html2canvas capture failed for', fallbacks[i].id, e);
      }
    }
  }

  // Add all pages to PDF with title and summary for each chart
  const pdfWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 10;
  let first = true;

  // Helper to draw one page: title, description, small data summary, then image
  const drawPage = (title: string, description: string, dataArr: number[] | null, imgData: string | null) => {
    if (!first) doc.addPage();
    first = false;

    // Title
    doc.setFontSize(18);
    doc.setFont(undefined as any, 'bold');
    doc.text(title, margin, 20);

    // Description (wrap)
    doc.setFontSize(11);
    doc.setFont(undefined as any, 'normal');
    const descLines = doc.splitTextToSize(description, pdfWidth - margin * 2);
    doc.text(descLines, margin, 30);

    // Data summary (total + monthly list)
    if (dataArr && dataArr.length) {
      const total = dataArr.reduce((a, b) => a + Number(b || 0), 0);
      doc.setFontSize(12);
      doc.text(`Total (selected year): ${total}`, margin, 30 + descLines.length * 6 + 6);

      // Monthly numbers as small text block
      const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      const monthlyText = months.map((m, i) => `${m}: ${dataArr[i] ?? 0}`).join('  ');
      const monthlyLines = doc.splitTextToSize(monthlyText, pdfWidth - margin * 2);
      doc.setFontSize(10);
      doc.text(monthlyLines, margin, 30 + descLines.length * 6 + 16);
    }

    // Draw image below the text
    if (imgData) {
      const imgProps = (doc as any).getImageProperties(imgData);
      const imgWidthMm = pdfWidth - margin * 2;
      const imgHeightMm = (imgProps.height * imgWidthMm) / imgProps.width;

      // place image after approx 60mm from top to allow title/desc
      const yPos = 30 + (description ? doc.splitTextToSize(description, pdfWidth - margin * 2).length * 6 : 0) + 30;
      const availableHeight = pageHeight - yPos - margin;
      const drawHeight = imgHeightMm > availableHeight ? availableHeight : imgHeightMm;
      doc.addImage(imgData, 'PNG', margin, yPos, imgWidthMm, drawHeight);
    }
  };

  // Prepare metadata and descriptions
  const co2Export = co2.value?.exportImage?.();
  const donationExport = donation.value?.exportImage?.();

  const co2Data = co2Export?.data ?? null;
  const donationData = donationExport?.data ?? null;

  const co2Desc = 'Charity CO₂ Impact — monthly CO₂ savings (kg) for the selected year.';
  const donationDesc = 'Donations Received — number of donations received per month (status 3 & 4).';

  drawPage('Charity CO₂ Impact', co2Desc, co2Data, pages[0] ?? co2Export?.img ?? null);
  drawPage('Donations Received', donationDesc, donationData, pages[1] ?? donationExport?.img ?? null);

  doc.save(filename);
};
</script>

<template>
  <main class="px-4 md:px-8 lg:px-16 flex flex-col gap-2 mb-6">
    <div class="w-full flex flex-col justify-center align-items center gap-6">
      <div>
        <UButton label="Generate Report" @click="exportPdf"/>
      </div>
      <div class="flex justify-center w-full" id="reports-co2-root">
        <ReportsCO2Chart ref="co2"/>
      </div>
      <div class="flex justify-center w-full" id="reports-donation-root">
        <ReportsDonationChart ref="donation"/>
      </div>
    </div>
  </main>
</template>

<style scoped>
main {
  text-align: center;
  color: default;
}
</style>