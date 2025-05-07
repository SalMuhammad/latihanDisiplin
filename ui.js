$(document).ready(function() {
    const hariList = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

    $("#btnTambahTugas").click(function() {
      $("#formContainer").removeClass("hidden");
    });

    $("#btnClose").click(function() {
      $("#formContainer").addClass("hidden");
      // Reset form
      $("#formInputs").html("").addClass("hidden");
      $("#btnSimpan").addClass("hidden");
      $("#jenisHabit").val("");
      $("#kategoriTugas").val("");
      $("#kategoriGroup").addClass("hidden");
    });

    $("#jenisHabit").change(function() {
      $("#kategoriGroup").removeClass("hidden");
      $("#kategoriTugas").val("");
      $("#formInputs").html("").addClass("hidden");
      $("#btnSimpan").addClass("hidden");
    });

    $("#kategoriTugas").change(function() {
      const kategori = $(this).val();
      $("#formInputs").html("").removeClass("hidden");
      $("#btnSimpan").addClass("hidden");

      const commonFields = `
        <label class="block text-gray-700 mb-1">Nama Kebiasaan:</label>
        <input type="text" id="namaTugas" placeholder="Contoh: Olahraga pagi" 
               class="w-full max-w-xs p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3" />

        <label class="block text-gray-700 mb-1">Nominal Hadiah (Rp):</label>
        <input type="number" id="nominalHadiah" min="0" 
               class="w-full max-w-xs p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
      `;

      if (kategori === "harian") {
        $("#formInputs").html(commonFields);
        $("#btnSimpan").removeClass("hidden");
      } else if (kategori === "mingguan") {
        const hariOptions = hariList.map(day => {
          const value = day.toLowerCase();
          return `<option value="${value}" ${value === 'sabtu' ? 'selected' : ''}>${day}</option>`;
        }).join("");

        $("#formInputs").html(`
          ${commonFields}
          <label class="block text-gray-700 mb-1 mt-3">Deadline Mingguan (Hari):</label>
          <select id="deadlineHari" class="w-full max-w-xs p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            ${hariOptions}
          </select>
        `);
        $("#btnSimpan").removeClass("hidden");
      } else if (kategori === "bulanan") {
        const tanggalOptions = Array.from({ length: 32 }, (_, i) => {
          const tanggal = i + 1;
          return `<option value="${tanggal}" ${tanggal === 32 ? "selected" : ""}>${tanggal}</option>`;
        }).join("");

        $("#formInputs").html(`
          ${commonFields}
          <label class="block text-gray-700 mb-1 mt-3">Deadline Bulanan (Tanggal):</label>
          <select id="deadlineTanggal" class="w-full max-w-xs p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            ${tanggalOptions}
          </select>
        `);
        $("#btnSimpan").removeClass("hidden");
      }
    });

    $("#btnSimpan").click(function() {
      const namaTugas = $("#namaTugas").val().trim();
      const nominalHadiah = $("#nominalHadiah").val();
      const kategori = $("#kategoriTugas").val();

      if (!namaTugas || !nominalHadiah) {
        alert("Nama kebiasaan dan hadiah wajib diisi!");
        return;
      }

      let deadlineInfo = "";
      if (kategori === "mingguan") {
        const deadline = $("#deadlineHari").val();
        deadlineInfo = `, Deadline: ${deadline}`;
      } else if (kategori === "bulanan") {
        const tanggal = $("#deadlineTanggal").val();
        deadlineInfo = `, Deadline: Tanggal ${tanggal}`;
      }

      $("#output").html(`
        <strong class="text-gray-800">Tugas Ditambahkan:</strong><br>
        <span class="text-gray-600">${namaTugas} - Rp. ${parseInt(nominalHadiah).toLocaleString()} (${kategori})${deadlineInfo}</span>
      `);

      // Reset
      $("#formInputs").html("").addClass("hidden");
      $("#formContainer").addClass("hidden");
      $("#btnSimpan").addClass("hidden");
      $("#jenisHabit").val("");
      $("#kategoriTugas").val("");
      $("#kategoriGroup").addClass("hidden");
    });
  });