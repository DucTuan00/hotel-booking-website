import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Booking, PaymentStatus, PaymentMethod } from '@/types/booking';
import moment from 'moment';
import { formatPrice } from '@/utils/formatPrice';

const HOTEL_INFO = {
    name: 'LION BOUTIQUE HOTEL',
    address: '105 P. Nguyễn Văn Tố, Hoàn Kiếm, Hà Nội, Việt Nam',
    city: 'TP. Hà Nội, Việt Nam',
    phone: '(+84) 987654321',
    email: 'admin@lionhotel.com',
    website: 'lionboutiquehotel.vercel.app',
};

const COLORS_PDF = {
    primary: '#000000', // Black for text
    secondary: '#000000', // Black for emphasis
    dark: '#000000',
    gray: '#666666',
    lightGray: '#F5F5F5',
    white: '#FFFFFF',
    border: '#DDDDDD',
};

const getPaymentStatusText = (status: PaymentStatus): string => {
    const statusMap: Record<PaymentStatus, string> = {
        [PaymentStatus.PAID]: 'Đã thanh toán',
        [PaymentStatus.UNPAID]: 'Chưa thanh toán',
        [PaymentStatus.REFUNDED]: 'Đã hoàn tiền',
    };
    return statusMap[status] || status;
};

/**
 * Create HTML template for invoice - inspired by professional hotel invoice design
 */
const createInvoiceHTML = (booking: Booking): string => {
    const roomData = typeof booking.roomId === 'object' ? booking.roomId : booking.room;
    const roomName = roomData?.name || 'N/A';
    const roomType = roomData?.roomType || 'N/A';
    const nights = moment(booking.checkOut).diff(moment(booking.checkIn), 'days');

    // Build combined table rows (room prices + celebrate items)
    let tableRows = '';
    let rowNumber = 1;

    // Add room price rows
    if (booking.snapshot?.dailyRates && booking.snapshot.dailyRates.length > 0) {
        booking.snapshot.dailyRates.forEach((rate) => {
            tableRows += `
                <tr>
                    <td style="padding: 8px 6px; border: 1px solid ${COLORS_PDF.border}; text-align: center;">${rowNumber}</td>
                    <td style="padding: 8px 6px; border: 1px solid ${COLORS_PDF.border};">${moment(rate.date).format('DD/MM/YYYY')}</td>
                    <td style="padding: 8px 6px; border: 1px solid ${COLORS_PDF.border};">
                        Tiền phòng
                    </td>
                    <td style="padding: 8px 6px; border: 1px solid ${COLORS_PDF.border}; text-align: center;">${booking.quantity}</td>
                    <td style="padding: 8px 6px; border: 1px solid ${COLORS_PDF.border}; text-align: right;">${formatPrice(rate.price / booking.quantity)}</td>
                    <td style="padding: 8px 6px; border: 1px solid ${COLORS_PDF.border}; text-align: right; font-weight: 600;">${formatPrice(rate.price)}</td>
                </tr>
            `;
            rowNumber++;
        });
    } else {
        const roomPrice = roomData?.price || 0;
        const dailyPrice = roomPrice * booking.quantity;
        for (let i = 0; i < nights; i++) {
            const date = moment(booking.checkIn).add(i, 'days');
            tableRows += `
                <tr>
                    <td style="padding: 8px 6px; border: 1px solid ${COLORS_PDF.border}; text-align: center;">${rowNumber}</td>
                    <td style="padding: 8px 6px; border: 1px solid ${COLORS_PDF.border};">${date.format('DD/MM/YYYY')}</td>
                    <td style="padding: 8px 6px; border: 1px solid ${COLORS_PDF.border};">
                        Tiền phòng
                    </td>
                    <td style="padding: 8px 6px; border: 1px solid ${COLORS_PDF.border}; text-align: center;">${booking.quantity}</td>
                    <td style="padding: 8px 6px; border: 1px solid ${COLORS_PDF.border}; text-align: right;">${formatPrice(roomPrice)}</td>
                    <td style="padding: 8px 6px; border: 1px solid ${COLORS_PDF.border}; text-align: right; font-weight: 600;">${formatPrice(dailyPrice)}</td>
                </tr>
            `;
            rowNumber++;
        }
    }

    // Add celebrate items to the same table
    if (booking.snapshot?.celebrateItems && booking.snapshot.celebrateItems.length > 0) {
        booking.snapshot.celebrateItems.forEach((item) => {
            tableRows += `
                <tr>
                    <td style="padding: 8px 6px; border: 1px solid ${COLORS_PDF.border}; text-align: center;">${rowNumber}</td>
                    <td style="padding: 8px 6px; border: 1px solid ${COLORS_PDF.border};">-</td>
                    <td style="padding: 8px 6px; border: 1px solid ${COLORS_PDF.border};">${item.name}</td>
                    <td style="padding: 8px 6px; border: 1px solid ${COLORS_PDF.border}; text-align: center;">${item.quantity}</td>
                    <td style="padding: 8px 6px; border: 1px solid ${COLORS_PDF.border}; text-align: right;">${formatPrice(item.price)}</td>
                    <td style="padding: 8px 6px; border: 1px solid ${COLORS_PDF.border}; text-align: right; font-weight: 600;">${formatPrice(item.subtotal)}</td>
                </tr>
            `;
            rowNumber++;
        });
    }

    return `
        <!DOCTYPE html>
        <html lang="vi">
        <head>
            <meta charset="UTF-8">
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body {
                    font-family: 'Inter', sans-serif;
                    color: #000;
                    line-height: 1.4;
                    font-size: 11px;
                }
            </style>
        </head>
        <body>
            <div style="width: 794px; padding: 40px 32px; background: white;">
                
                <!-- Header with Logo area -->
                <table style="width: 100%; margin-bottom: 24px;">
                    <tr>
                        <td style="width: 70%; text-align: right; vertical-align: top;">
                            <div style="font-weight: bold; font-size: 14px; margin-bottom: 4px;">${HOTEL_INFO.name}</div>
                            <div style="font-size: 10px; color: ${COLORS_PDF.gray};">${HOTEL_INFO.address}</div>
                            <div style="font-size: 10px; color: ${COLORS_PDF.gray};"><strong>T</strong> ${HOTEL_INFO.phone} <strong>E</strong> ${HOTEL_INFO.email}</div>
                            <div style="font-size: 10px; color: ${COLORS_PDF.gray};">${HOTEL_INFO.website}</div>
                        </td>
                    </tr>
                </table>

                <!-- Invoice Title -->
                <h2 style="text-align: center; font-size: 18px; font-weight: bold; margin-bottom: 20px; letter-spacing: 2px;">
                    HÓA ĐƠN
                </h2>

                <!-- Invoice Info Line -->
                <div style="font-size: 10px; margin-bottom: 16px; border-top: 1px solid ${COLORS_PDF.border}; border-bottom: 1px solid ${COLORS_PDF.border}; padding: 8px 0;">
                    <table style="width: 100%;">
                        <tr>
                            <td>Mã hóa đơn: <strong>${booking.bookingCode || booking.id}</strong></td>
                            <td>Ngày: <strong>${moment().format('DD/MM/YYYY HH:mm')}</strong></td>
                        </tr>
                    </table>
                </div>

                <!-- Booking Details -->
                <table style="width: 100%; margin-bottom: 16px; font-size: 10px; border: 1px solid ${COLORS_PDF.border};">
                    <tr>
                        <td style="padding: 6px; border: 1px solid ${COLORS_PDF.border}; width: 25%;">Khách hàng</td>
                        <td style="padding: 6px; border: 1px solid ${COLORS_PDF.border}; width: 25%; font-weight: 600;">${booking.firstName} ${booking.lastName}</td>
                        <td style="padding: 6px; border: 1px solid ${COLORS_PDF.border}; width: 25%;">Phòng</td>
                        <td style="padding: 6px; border: 1px solid ${COLORS_PDF.border}; width: 25%; font-weight: 600;">${roomName}</td>
                    </tr>
                    <tr>
                        <td style="padding: 6px; border: 1px solid ${COLORS_PDF.border}; width: 25%;">Ngày nhận phòng</td>
                        <td style="padding: 6px; border: 1px solid ${COLORS_PDF.border}; width: 25%; font-weight: 600;">${moment(booking.checkIn).format('DD/MM/YYYY')}</td>
                        <td style="padding: 6px; border: 1px solid ${COLORS_PDF.border}; width: 25%;">Thời gian đến</td>
                        <td style="padding: 6px; border: 1px solid ${COLORS_PDF.border}; width: 25%; font-weight: 600;">14:00:00</td>
                    </tr>
                    <tr>
                        <td style="padding: 6px; border: 1px solid ${COLORS_PDF.border};">Ngày trả phòng</td>
                        <td style="padding: 6px; border: 1px solid ${COLORS_PDF.border}; font-weight: 600;">${moment(booking.checkOut).format('DD/MM/YYYY')}</td>
                        <td style="padding: 6px; border: 1px solid ${COLORS_PDF.border};">Thời gian trả</td>
                        <td style="padding: 6px; border: 1px solid ${COLORS_PDF.border}; font-weight: 600;">12:00:00</td>
                    </tr>
                    <tr>
                        <td style="padding: 6px; border: 1px solid ${COLORS_PDF.border};">Loại phòng</td>
                        <td style="padding: 6px; border: 1px solid ${COLORS_PDF.border}; font-weight: 600;">${roomType}</td>
                        <td style="padding: 6px; border: 1px solid ${COLORS_PDF.border};">Số đêm lưu trú</td>
                        <td style="padding: 6px; border: 1px solid ${COLORS_PDF.border}; font-weight: 600;">${nights}</td>
                    </tr>
                    <tr>
                        
                    </tr>
                </table>

                <!-- Price Table -->
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 12px; font-size: 10px;">
                    <thead>
                        <tr style="background: ${COLORS_PDF.lightGray};">
                            <th style="padding: 8px 6px; border: 1px solid ${COLORS_PDF.border}; text-align: center; width: 5%;">#</th>
                            <th style="padding: 8px 6px; border: 1px solid ${COLORS_PDF.border}; text-align: left; width: 15%;">Ngày</th>
                            <th style="padding: 8px 6px; border: 1px solid ${COLORS_PDF.border}; text-align: left; width: 30%;">Nội dung</th>
                            <th style="padding: 8px 6px; border: 1px solid ${COLORS_PDF.border}; text-align: center; width: 12%;">Số lượng</th>
                            <th style="padding: 8px 6px; border: 1px solid ${COLORS_PDF.border}; text-align: right; width: 18%;">Đơn giá</th>
                            <th style="padding: 8px 6px; border: 1px solid ${COLORS_PDF.border}; text-align: right; width: 20%;">Thành tiền</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>

                <!-- Totals Summary -->
                <table style="width: 100%; font-size: 10px; margin-bottom: 16px;">
                    <tr>
                        <td style="width: 65%;"></td>
                        <td style="width: 35%;">
                            <table style="width: 100%; border: 1px solid ${COLORS_PDF.border};">
                                ${
                                    booking.snapshot?.pricing
                                        ? `
                                <tr>
                                    <td style="padding: 6px; border: 1px solid ${COLORS_PDF.border};">Tổng phụ</td>
                                    <td style="padding: 6px; border: 1px solid ${COLORS_PDF.border}; text-align: right; font-weight: 600;">${formatPrice(booking.snapshot.pricing.roomSubtotal + booking.snapshot.pricing.celebrateItemsSubtotal)}</td>
                                </tr>
                                `
                                        : ''
                                }
                                <tr style="background: ${COLORS_PDF.lightGray};">
                                    <td style="padding: 8px 6px; border: 1px solid ${COLORS_PDF.border}; font-weight: bold;">Tổng cộng</td>
                                    <td style="padding: 8px 6px; border: 1px solid ${COLORS_PDF.border}; text-align: right; font-weight: bold; font-size: 12px;">${formatPrice(booking.totalPrice)}</td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>

                <!-- Payment Info -->
                <div style="font-size: 10px; margin-bottom: 16px;">
                    <div style="font-weight: bold; margin-bottom: 6px;">Thông tin thanh toán</div>
                    <table style="width: 100%; border: 1px solid ${COLORS_PDF.border};">
                        <tr>
                            <td style="padding: 6px; border: 1px solid ${COLORS_PDF.border}; width: 30%;">Trạng thái thanh toán</td>
                            <td style="padding: 6px; border: 1px solid ${COLORS_PDF.border}; font-weight: 600;">${getPaymentStatusText(booking.paymentStatus)}</td>
                        </tr>
                        <tr>
                            <td style="padding: 6px; border: 1px solid ${COLORS_PDF.border};">Phương thức thanh toán</td>
                            <td style="padding: 6px; border: 1px solid ${COLORS_PDF.border}; font-weight: 600;">${booking.paymentMethod === PaymentMethod.ONLINE ? 'Thanh toán online' : 'Thanh toán tại quầy'}</td>
                        </tr>
                        <tr>
                            <td style="padding: 6px; border: 1px solid ${COLORS_PDF.border};">Ngày đặt phòng</td>
                            <td style="padding: 6px; border: 1px solid ${COLORS_PDF.border}; font-weight: 600;">${moment(booking.createdAt).format('DD/MM/YYYY HH:mm')}</td>
                        </tr>
                    </table>
                </div>

                <!-- Footer Note -->
                <div style="margin-top: 32px; font-size: 9px; text-align: center; color: ${COLORS_PDF.gray}; border-top: 1px solid ${COLORS_PDF.border}; padding-top: 12px;">
                    <div style="margin-bottom: 4px;">Cảm ơn quý khách đã tin tưởng và lựa chọn ${HOTEL_INFO.name}!</div>
                    <div>Mọi thắc mắc xin vui lòng liên hệ: ${HOTEL_INFO.phone} | ${HOTEL_INFO.email}</div>
                </div>

            </div>
        </body>
        </html>
    `;
};

/**
 * Generate and download booking invoice PDF with Vietnamese support
 */
export const generateBookingPDF = async (booking: Booking): Promise<void> => {
    // Create hidden iframe to render content without affecting main page
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.width = '794px';
    iframe.style.height = '1px';
    iframe.style.opacity = '0';
    iframe.style.pointerEvents = 'none';
    iframe.style.left = '-10000px';
    document.body.appendChild(iframe);

    try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
        if (!iframeDoc) {
            throw new Error('Cannot access iframe document');
        }

        // Write HTML to iframe
        iframeDoc.open();
        iframeDoc.write(createInvoiceHTML(booking));
        iframeDoc.close();

        // Wait for fonts and rendering
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const invoiceElement = iframeDoc.body.querySelector('div') as HTMLElement;
        if (!invoiceElement) {
            throw new Error('Invoice element not found');
        }

        // Create PDF
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        // Capture entire invoice as canvas
        const canvas = await html2canvas(invoiceElement, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            logging: false,
            backgroundColor: '#ffffff',
            width: 794,
            windowWidth: 794,
        });

        // Convert canvas to image
        const imgData = canvas.toDataURL('image/png', 1.0);
        const imgWidth = pdfWidth;
        const imgHeight = (canvas.height * pdfWidth) / canvas.width;
        
        let heightLeft = imgHeight;
        let position = 0;

        // Add first page
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;

        // Add additional pages if needed
        while (heightLeft > 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pdfHeight;
        }

        // Remove iframe
        document.body.removeChild(iframe);

        // Save PDF
        const fileName = `HoaDon_${booking.bookingCode || booking.id}_${moment().format('YYYYMMDD')}.pdf`;
        pdf.save(fileName);
    } catch (error) {
        // Clean up iframe on error
        if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
        }
        console.error('Error generating PDF:', error);
        throw new Error('Không thể tạo file PDF. Vui lòng thử lại.');
    }
};
