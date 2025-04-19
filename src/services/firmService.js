import apiClient from "./api.js";

const FirmService = {
  createShowSchedule: async (scheduleData) => {
    try {
      const response = await apiClient.post(
        "/api/QuanLyDatVe/TaoLichChieu",
        scheduleData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const responseData = response.data || {};

      if (responseData.content) {
        return {
          items: responseData.content || [],
        };
      }
    } catch (error) {
      console.error("Error fetching cinema system data:", error);
      throw error;
    }
  },
  getCinemaClusters: async (cinemaSystemId) => {
    try {
      const response = await apiClient.get(
        `/api/QuanLyRap/LayThongTinCumRapTheoHeThong?maHeThongRap=${cinemaSystemId}`
      );

      const responseData = response.data || {};

      if (responseData.content) {
        return {
          items: responseData.content || [],
        };
      }
    } catch (error) {
      console.error("Error fetching cinema system data:", error);
      throw error;
    }
  },
  getCinemaSystems: async () => {
    try {
      const response = await apiClient.get(
        `/api/QuanLyRap/LayThongTinHeThongRap`
      );

      const responseData = response.data || {};

      if (responseData.content) {
        return {
          items: responseData.content || [],
        };
      }
    } catch (error) {
      console.error("Error fetching cinema system data:", error);
      throw error;
    }
  },
  getFilmsPaginated: async (currentPage = 1, itemsPerPage = 10) => {
    try {
      const response = await apiClient.get(
        `/api/QuanLyPhim/LayDanhSachPhimPhanTrang?maNhom=GP01&soTrang=${currentPage}&soPhanTuTrenTrang=${itemsPerPage}`
      );

      const responseData = response.data || {};

      if (responseData.content?.items) {
        return {
          items: responseData.content.items || [],
          totalCount: responseData.content.totalCount || 0,
          totalPages: responseData.content.totalPages || 0,
        };
      }
    } catch (error) {
      console.error("Error fetching paginated film data:", error);
      throw error;
    }
  },
  deleteFilm: async (filmId) => {
    try {
      const response = await apiClient.delete(
        `/api/QuanLyPhim/XoaPhim?MaPhim=${filmId}`
      );
      return response.data || filmId;
    } catch (error) {
      console.error("Error deleting film:", error);
      throw error;
    }
  },
  updateFilm: async (filmData) => {
    try {
      const response = await apiClient.post(
        "/api/QuanLyPhim/CapNhatPhimUpload",
        filmData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data || filmData;
    } catch (error) {
      console.error("Error updating film:", error);
      throw error;
    }
  },

  addFilm: async (filmData) => {
    try {
      const response = await apiClient.post(
        "/api/QuanLyPhim/ThemPhimUploadHinh",
        filmData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("API response:", response.data);
      return response.data || filmData;
    } catch (error) {
      console.error("Error adding film:", error);
      throw error;
    }
  },
};

export default FirmService;
