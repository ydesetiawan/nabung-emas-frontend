/**
 * Internationalization (i18n) translations
 * Support for English (en) and Indonesian (id)
 */

export const translations = {
    en: {
        // Navigation
        nav: {
            home: 'Home',
            pockets: 'Pockets',
            history: 'History',
            analytics: 'Analytics',
        },

        // Dashboard
        dashboard: {
            welcomeBack: 'Welcome back',
            goldSavings: 'Gold Savings',
            totalPortfolio: 'Total Portfolio Value',
            totalWeight: 'Total Weight',
            avgPrice: 'Avg. Price/g',
            profitLoss: 'Profit/Loss',
            pockets: 'Pockets',
            transactions: 'Transactions',
            marketPrice: 'Market Price',
            viewPockets: 'View Pockets',
            viewHistory: 'View History',
            addTransaction: 'Add Transaction',
        },

        // Pockets
        pockets: {
            title: 'Pockets',
            newPocket: 'New Pocket',
            searchPlaceholder: 'Search pockets...',
            all: 'All',
            totalPockets: 'Total Pockets',
            weight: 'Weight',
            value: 'Value',
            progress: 'Progress',
            noPocketsFound: 'No pockets found',
            tryAdjusting: 'Try adjusting your search',
            createFirst: 'Create your first pocket to start saving gold',
            createPocket: 'Create Pocket',
        },

        // Transactions
        transactions: {
            title: 'Transactions',
            filters: 'Filters',
            searchPlaceholder: 'Search transactions...',
            dateRange: 'Date Range',
            allTime: 'All Time',
            days7: '7 Days',
            days30: '30 Days',
            months3: '3 Months',
            year1: '1 Year',
            pocket: 'Pocket',
            allPockets: 'All Pockets',
            brand: 'Brand',
            allBrands: 'All Brands',
            sortBy: 'Sort By',
            newestFirst: 'Newest First',
            oldestFirst: 'Oldest First',
            highestAmount: 'Highest Amount',
            lowestAmount: 'Lowest Amount',
            heaviestWeight: 'Heaviest Weight',
            lightestWeight: 'Lightest Weight',
            clearFilters: 'Clear All Filters',
            totalTransactions: 'Transactions',
            noTransactionsFound: 'No transactions found',
            tryDifferentFilters: 'Try different filters',
            adjustFilters: 'Try adjusting your filters',
            addFirst: 'Add your first gold purchase to get started',
        },

        // Analytics
        analytics: {
            title: 'Analytics',
            portfolioValue: 'Portfolio Value',
            goldAccumulation: 'Gold Accumulation',
            monthlyPurchases: 'Monthly Purchases',
            portfolioDistribution: 'Portfolio Distribution',
            topPockets: 'Top Pockets',
            priceComparison: 'Price Comparison',
            yourAvgPrice: 'Your Avg Price',
            marketPrice: 'Market Price',
            priceDifference: 'Price Difference',
            exportData: 'Export Data',
            exportDescription: 'Export your portfolio data for tax reporting or personal records',
            avgMonthly: 'Avg. Monthly Purchase',
        },

        // Add Transaction
        addTransaction: {
            title: 'Add Transaction',
            selectPocket: 'Select a pocket',
            transactionDate: 'Transaction Date',
            goldBrand: 'Gold Brand',
            selectBrand: 'Select brand',
            weightGrams: 'Weight (grams)',
            pricePerGram: 'Price per Gram (IDR)',
            totalPrice: 'Total Price',
            autoCalculated: 'Auto-calculated from weight × price per gram',
            description: 'Description (Optional)',
            descriptionPlaceholder: 'Add notes about this transaction...',
            receiptPhoto: 'Receipt Photo (Optional)',
            uploadReceipt: 'Upload receipt image',
            saveTransaction: 'Save Transaction',
            saving: 'Saving...',
            cancel: 'Cancel',
            required: 'Required',
            minWeight: 'Min',
            maxWeight: 'Max',
        },

        // Settings
        settings: {
            title: 'Settings',
            appearance: 'Appearance',
            darkMode: 'Dark Mode',
            darkModeDesc: 'Toggle dark mode theme',
            language: 'Language',
            languageDesc: 'Choose your preferred language',
            english: 'English',
            indonesian: 'Indonesian',
            about: 'About',
            version: 'Version',
            madeWith: 'Made with ❤️ for gold investors',
        },

        // Common
        common: {
            save: 'Save',
            cancel: 'Cancel',
            delete: 'Delete',
            edit: 'Edit',
            close: 'Close',
            back: 'Back',
            next: 'Next',
            confirm: 'Confirm',
            loading: 'Loading...',
            error: 'Error',
            success: 'Success',
            seeAll: 'See All',
        },
    },

    id: {
        // Navigation
        nav: {
            home: 'Beranda',
            pockets: 'Kantong',
            history: 'Riwayat',
            analytics: 'Analitik',
        },

        // Dashboard
        dashboard: {
            welcomeBack: 'Selamat datang kembali',
            goldSavings: 'Tabungan Emas',
            totalPortfolio: 'Total Nilai Portofolio',
            totalWeight: 'Total Berat',
            avgPrice: 'Harga Rata-rata/g',
            profitLoss: 'Untung/Rugi',
            pockets: 'Kantong',
            transactions: 'Transaksi',
            marketPrice: 'Harga Pasar',
            viewPockets: 'Lihat Kantong',
            viewHistory: 'Lihat Riwayat',
            addTransaction: 'Tambah Transaksi',
        },

        // Pockets
        pockets: {
            title: 'Kantong',
            newPocket: 'Kantong Baru',
            searchPlaceholder: 'Cari kantong...',
            all: 'Semua',
            totalPockets: 'Total Kantong',
            weight: 'Berat',
            value: 'Nilai',
            progress: 'Progres',
            noPocketsFound: 'Kantong tidak ditemukan',
            tryAdjusting: 'Coba sesuaikan pencarian Anda',
            createFirst: 'Buat kantong pertama Anda untuk mulai menabung emas',
            createPocket: 'Buat Kantong',
        },

        // Transactions
        transactions: {
            title: 'Transaksi',
            filters: 'Filter',
            searchPlaceholder: 'Cari transaksi...',
            dateRange: 'Rentang Tanggal',
            allTime: 'Semua Waktu',
            days7: '7 Hari',
            days30: '30 Hari',
            months3: '3 Bulan',
            year1: '1 Tahun',
            pocket: 'Kantong',
            allPockets: 'Semua Kantong',
            brand: 'Merek',
            allBrands: 'Semua Merek',
            sortBy: 'Urutkan',
            newestFirst: 'Terbaru',
            oldestFirst: 'Terlama',
            highestAmount: 'Nilai Tertinggi',
            lowestAmount: 'Nilai Terendah',
            heaviestWeight: 'Berat Terberat',
            lightestWeight: 'Berat Teringan',
            clearFilters: 'Hapus Semua Filter',
            totalTransactions: 'Transaksi',
            noTransactionsFound: 'Transaksi tidak ditemukan',
            tryDifferentFilters: 'Coba filter yang berbeda',
            adjustFilters: 'Coba sesuaikan filter Anda',
            addFirst: 'Tambahkan pembelian emas pertama Anda',
        },

        // Analytics
        analytics: {
            title: 'Analitik',
            portfolioValue: 'Nilai Portofolio',
            goldAccumulation: 'Akumulasi Emas',
            monthlyPurchases: 'Pembelian Bulanan',
            portfolioDistribution: 'Distribusi Portofolio',
            topPockets: 'Kantong Teratas',
            priceComparison: 'Perbandingan Harga',
            yourAvgPrice: 'Harga Rata-rata Anda',
            marketPrice: 'Harga Pasar',
            priceDifference: 'Selisih Harga',
            exportData: 'Ekspor Data',
            exportDescription: 'Ekspor data portofolio Anda untuk laporan pajak atau catatan pribadi',
            avgMonthly: 'Rata-rata Pembelian Bulanan',
        },

        // Add Transaction
        addTransaction: {
            title: 'Tambah Transaksi',
            selectPocket: 'Pilih kantong',
            transactionDate: 'Tanggal Transaksi',
            goldBrand: 'Merek Emas',
            selectBrand: 'Pilih merek',
            weightGrams: 'Berat (gram)',
            pricePerGram: 'Harga per Gram (IDR)',
            totalPrice: 'Total Harga',
            autoCalculated: 'Dihitung otomatis dari berat × harga per gram',
            description: 'Deskripsi (Opsional)',
            descriptionPlaceholder: 'Tambahkan catatan tentang transaksi ini...',
            receiptPhoto: 'Foto Struk (Opsional)',
            uploadReceipt: 'Unggah gambar struk',
            saveTransaction: 'Simpan Transaksi',
            saving: 'Menyimpan...',
            cancel: 'Batal',
            required: 'Wajib',
            minWeight: 'Min',
            maxWeight: 'Maks',
        },

        // Settings
        settings: {
            title: 'Pengaturan',
            appearance: 'Tampilan',
            darkMode: 'Mode Gelap',
            darkModeDesc: 'Aktifkan tema gelap',
            language: 'Bahasa',
            languageDesc: 'Pilih bahasa yang Anda inginkan',
            english: 'English',
            indonesian: 'Bahasa Indonesia',
            about: 'Tentang',
            version: 'Versi',
            madeWith: 'Dibuat dengan ❤️ untuk investor emas',
        },

        // Common
        common: {
            save: 'Simpan',
            cancel: 'Batal',
            delete: 'Hapus',
            edit: 'Edit',
            close: 'Tutup',
            back: 'Kembali',
            next: 'Lanjut',
            confirm: 'Konfirmasi',
            loading: 'Memuat...',
            error: 'Error',
            success: 'Berhasil',
            seeAll: 'Lihat Semua',
        },
    },
}

export type Locale = keyof typeof translations
export type TranslationKeys = (typeof translations)[Locale]
