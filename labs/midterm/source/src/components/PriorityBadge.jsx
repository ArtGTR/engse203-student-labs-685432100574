function PriorityBadge({ priority }) {
  if (priority === 'urgent') {
    return <span className="priority-urgent">เร่งด่วน</span>;
  }
  
  if (priority === 'normal') {
    return <span className="priority-normal">ปกติ</span>;
  }

  // CP-B4.2: จัดการ edge case หาก priority เป็นค่าอื่น หรือไม่มีค่าส่งมา
  return <span className="priority-unknown">ไม่ระบุ</span>;
}

export default PriorityBadge;