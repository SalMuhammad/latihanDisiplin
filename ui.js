const hariList = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

$("#btnTambahTugas").click(function() {
  $("#formContainer").show();
});

$("#btnClose").click(function() {
  $("#formContainer").hide();
  $("#formInputs").hide().html("");
  $("#btnSimpan").hide();
  $("#jenisHabit").val("");
  $("#kategoriTugas").val("");
  $("#kategoriGroup").hide();
});

$("#jenisHabit").change(function() {
  $("#kategoriGroup").show();
  $("#kategoriTugas").val("");
  $("#formInputs").hide().html("");
  $("#btnSimpan").hide();
});

$("#kategoriTugas").change(function() {
  const kategori = $(this).val();
  let html = "";
  const commonFields = `
    <input type="text" id="namaTugas" placeholder="Nama Kebiasaan" style="width: 100%; padding: 6px; margin-bottom: 8px;" />
    <textarea id="deskripsiTugas" placeholder="Deskripsi" style="width: 100%; padding: 6px; margin-bottom: 8px;"></textarea>
    <select id="prioritasTugas" style="width: 100%; padding: 6px; margin-bottom: 8px;">
      <option value="">-- Prioritas --</option>
      <option value="Tinggi">Tinggi</option>
      <option value="Sedang">Sedang</option>
      <option value="Rendah">Rendah</option>
    </select>
    <input type="number" id="nominalHadiah" min="0" placeholder="Nominal Hadiah (Rp)" style="width: 100%; padding: 6px; margin-bottom: 8px;" />
  `;

  if (kategori === "harian") {
    html = commonFields;
  } else if (kategori === "mingguan") {
    const hariOptions = hariList.map(day => `<option value="${day.toLowerCase()}" ${day === 'Sabtu' ? 'selected' : ''}>${day}</option>`).join("");
    html = `${commonFields}<select id="deadlineHari" style="width: 100%; padding: 6px; margin-bottom: 8px;">${hariOptions}</select>`;
  } else if (kategori === "bulanan") {
    const tanggalOptions = Array.from({ length: 32 }, (_, i) => i + 1).map(tgl => `<option value="${tgl}" ${tgl === 32 ? "selected" : ""}>${tgl}</option>`).join("");
    html = `${commonFields}<select id="deadlineTanggal" style="width: 100%; padding: 6px; margin-bottom: 8px;">${tanggalOptions}</select>`;
  }

  $("#formInputs").html(html).show();
  $("#btnSimpan").show();
});






// -------------------------------------
// ? Fungsi Menyimpan dan Merender Data Tugas
// -------------------------------------

$(document).ready(function () {
  // Fungsi bantu: warna berdasarkan prioritas
  function getPriorityColorClass(prioritas) {
    switch (prioritas.toLowerCase()) {
      case "tinggi":
        return "bg-red-100 text-red-800";
      case "sedang":
        return "bg-yellow-100 text-yellow-800";
      case "rendah":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-700";
    }
  }

  // Fungsi utama render berdasarkan localStorage
  function renderTugas(jenis, kategori) {
    const container = $('#daftar-rutinitas');
    container.empty();

    const dataTugas = JSON.parse(localStorage.getItem("dataTugas")) || {
      pembentukan: { harian: [], mingguan: [], bulanan: [] },
      pemusnahan: { harian: [], mingguan: [], bulanan: [] }
    };

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

  // -------------------------------------
  // ? Interaksi Halaman
  // -------------------------------------

  let currentJenis = "pembentukan";
  let currentKategori = "harian";

  // Render awal saat dokumen siap
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

  // -------------------------------------
  // ? Simpan ke localStorage dari Form
  // -------------------------------------

  $('#btnSimpan').click(function () {
    const jenis = $('#jenisHabit').val();
    const kategori = $('#kategoriTugas').val();
    const namaTugas = $('#namaTugas').val().trim();
    const deskripsi = $('#deskripsiTugas').val().trim();
    const prioritas = $('#prioritasTugas').val();
    const nominalHadiah = parseInt($('#nominalHadiah').val());

    if (!jenis || !kategori || !namaTugas || !deskripsi || !prioritas || !nominalHadiah) {
      alert('Semua field wajib diisi!');
      return;
    }

    const newTugas = {
      judul: namaTugas,
      deskripsi: deskripsi,
      prioritas: prioritas,
      poin: nominalHadiah,
    };

    let dataTugas = JSON.parse(localStorage.getItem("dataTugas")) || {
      pembentukan: { harian: [], mingguan: [], bulanan: [] },
      pemusnahan: { harian: [], mingguan: [], bulanan: [] },
    };

    dataTugas[jenis][kategori].push(newTugas);
    localStorage.setItem("dataTugas", JSON.stringify(dataTugas));

    $('#output').html(`
      <strong>Tugas Ditambahkan:</strong><br>
      <span>${newTugas.judul} - ${newTugas.prioritas}, Rp ${newTugas.poin.toLocaleString()} (${kategori})</span>
    `);

    $('#formInputs').html('').addClass('hidden');
    $('#formContainer').addClass('hidden');
    $('#btnSimpan').addClass('hidden');
    $('#jenisHabit').val("");
    $('#kategoriTugas').val("");
    $('#kategoriGroup').addClass('hidden');

    // Refresh tampilan tugas setelah menambah
    renderTugas(currentJenis, currentKategori);
  });
});
