const summaryItems = [
  ['total', 'ทั้งหมด'],
  ['todo', 'ต้องทำ'],
  ['doing', 'กำลังทำ'],
  ['done', 'เสร็จแล้ว'],
];





function SummaryPanel() {

  return (
    <section className="panel" aria-labelledby="summary-title">
      <h2 id="summary-title">ภาพรวม</h2>
      <p>ทั้งหมด 3 รายการ</p>
    </section>
  );
}

export default SummaryPanel;