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

