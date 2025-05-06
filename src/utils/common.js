/**
 * Format tiền Việt Nam Đồng
 * @param {number} amount - Số tiền cần format
 * @returns {string} - Chuỗi tiền đã format kèm ₫
 */
export const formatVnd = (amount) => {
  return amount.toLocaleString('vi-VN') + '₫';
}

export const extractSuffixSlug = (slug) => {
  const lastDashIndex = slug.lastIndexOf("-");
  if (lastDashIndex === -1) {
    return { prefix: slug, suffix: "" };
  }

  return {
    prefix: slug.substring(0, lastDashIndex),
    suffix: slug.substring(lastDashIndex + 1),
  };
}

/**
 * format yyyy-mm-dd
 * @param {*} date 
 * @returns dateString
 */
export const formatDateYYYYMMDD = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // thêm số 0 nếu nhỏ hơn 10
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};


export const formatDateVN = (dateStr) => {
  const date = new Date(dateStr);

  return date.toLocaleString('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}