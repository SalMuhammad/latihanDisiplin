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










  // -------------------------------------
  // ? interaksi halaman utama pemilihan
  // --------------------------------------
  $(document).ready(function() {
    const dataTugas = {
        pembentukan: {
            harian: [
                { judul: "Bangun pagi", deskripsi: "Bangun sebelum subuh", prioritas: "Tinggi", poin: 3000 },
                { judul: "Olahraga", deskripsi: "15 menit stretching", prioritas: "Sedang", poin: 2000 },
            ],
            mingguan: [
                { judul: "Bersih-bersih kamar", deskripsi: "Rapikan kamar setiap Sabtu", prioritas: "Tinggi", poin: 2500 },
            ],
            bulanan: [
                { judul: "Evaluasi diri", deskripsi: "Refleksi dan review kebiasaan", prioritas: "Tinggi", poin: 4000 },
            ]
        },
        pemusnahan: {
            harian: [
                { judul: "Kurangi rokok", deskripsi: "Batasi maksimal 1 batang", prioritas: "Tinggi", poin: 5000 },
            ],
            mingguan: [
                { judul: "Kurangi begadang", deskripsi: "Tidur sebelum jam 11 malam", prioritas: "Sedang", poin: 3500 },
            ],
            bulanan: [
                { judul: "Stop junk food", deskripsi: "Tidak makan fast food sebulan", prioritas: "Tinggi", poin: 6000 },
            ]
        }
    };

   

    let currentJenis = 'pembentukan';
let currentKategori = 'harian';

// Helper warna otomatis untuk prioritas
function getPriorityColorClass(prioritas) {
    switch (prioritas.toLowerCase()) {
        case 'tinggi':
            return 'bg-red-100 text-red-800';
        case 'sedang':
            return 'bg-yellow-100 text-yellow-800';
        case 'rendah':
            return 'bg-green-100 text-green-800';
        default:
            return 'bg-gray-100 text-gray-700';
    }
}

function renderTugas(jenis, kategori) {
    const container = $('#daftar-rutinitas');
    container.empty();

    const tugasList = dataTugas[jenis][kategori] || [];

    tugasList.forEach((tugas, index) => {
        const priorityClass = getPriorityColorClass(tugas.prioritas);

        const card = `
            <label class="block w-full">
                <div class="card shadow-md hover:shadow-lg transition-all duration-300 p-2 rounded-lg bg-white mb-3 border-l-4 border-violet-600 relative overflow-hidden group cursor-pointer select-none">
                    <div class="absolute top-0 right-0 w-32 h-32 bg-violet-100 rounded-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div class="flex items-center justify-between relative">
                        <div class="flex items-center gap-3">
                            <div class="relative">
                                <input type="checkbox" id="tugas${jenis}${kategori}${index}" class="peer sr-only">
                                <div class="h-6 w-6 rounded-md border-2 border-violet-600 peer-checked:bg-violet-600 peer-checked:border-violet-600 transition-all duration-300 flex items-center justify-center">
                                    <i class="bi bi-check-lg text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-300"></i>
                                </div>
                            </div>
                            <div>
                                <div class="flex items-center gap-2">
                                    <span class="text-gray-800 font-medium group-hover:text-violet-600 transition-colors duration-300">${tugas.judul}</span>
                                    <span class="px-2 py-0.5 text-xs rounded-full ${priorityClass}">Prioritas ${tugas.prioritas}</span>
                                </div>
                                <p class="text-sm text-gray-500">${tugas.deskripsi}</p>
                                <div class="mt-1 w-full bg-gray-200 rounded-full h-1.5">
                                    <div class="bg-violet-600 h-1.5 rounded-full" style="width: ${tugas.poin / 100}%"></div>
                                </div>
                            </div>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="text-violet-600 font-semibold">${tugas.poin}</span>
                            <i class="bi bi-coin text-yellow-500"></i>
                        </div>
                    </div>
                </div>
            </label>
        `;
        container.append(card);
    });
  }

  // Inisialisasi awal
  renderTugas(currentJenis, currentKategori);

  $('#pembentukan').on('click', function () {
      currentJenis = 'pembentukan';
      $('#pembentukan a').addClass('bg-violet-800 text-white');
      $('#pemusnahan a').removeClass('bg-violet-800 text-white');
      renderTugas(currentJenis, currentKategori);
  });

  $('#pemusnahan').on('click', function () {
      currentJenis = 'pemusnahan';
      $('#pemusnahan a').addClass('bg-violet-800 text-white');
      $('#pembentukan a').removeClass('bg-violet-800 text-white');
      renderTugas(currentJenis, currentKategori);
  });

  $('#nav-repetision a').on('click', function () {
      $('#nav-repetision a').removeClass('bg-white text-violet-800');
      $(this).addClass('bg-white text-violet-800');

      currentKategori = $(this).attr('id');
      renderTugas(currentJenis, currentKategori);
  });

});
