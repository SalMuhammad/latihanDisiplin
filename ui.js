

$("#btnTambahTugas").click(function () {
  $("#formContainer").show();
  // Set default value
  $("#jenisHabit").val("pembentukan");
  $("#kategoriGroup").show();
  $("#kategoriTugas").val("harian");

  // Langsung render form default (harian)
  renderFormInputs("harian");
  $("#btnSimpan").show();
});

// tutup form input
$("#btnClose").click(function () {
  $("#formContainer").hide();
  $("#formInputs").hide().html("");
  $("#btnSimpan").hide();
  $("#jenisHabit").val("");
  $("#kategoriTugas").val("");
  $("#kategoriGroup").hide();
});

// Jika user ganti kategori
$("#kategoriTugas").change(function () {
  const kategori = $(this).val();
  renderFormInputs(kategori);
  $("#btnSimpan").show();
});


// Jika user ganti jenisHabit, kosongkan kategori & formInputs
$("#jenisHabit").change(function () {
  $("#kategoriGroup").show();
  $("#kategoriTugas").val("harian").trigger("change");
});

// Satu-satunya handler kategoriTugas yang benar
$("#kategoriTugas").change(function () {
  const kategori = $(this).val();
  renderFormInputs(kategori);
  $("#btnSimpan").show();
});



const hariList = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
function renderFormInputs(kategori) {
  const commonFields = `
    <input type="text" id="namaTugas" placeholder="Nama Kebiasaan" style="width: 100%; padding: 6px; margin-bottom: 8px;" />
    <textarea id="deskripsiTugas" placeholder="Deskripsi" style="width: 100%; padding: 6px; margin-bottom: 8px;"></textarea>
    <select id="prioritasTugas" style="width: 100%; padding: 6px; margin-bottom: 8px;">
      <option value="Tinggi">Tinggi</option>
      <option value="Sedang" selected>Sedang</option>
      <option value="Rendah">Rendah</option>
    </select>
    <input type="number" id="nominalHadiah" min="0" placeholder="Nominal Hadiah (Rp)" style="width: 100%; padding: 6px; margin-bottom: 8px;" />
  `;

  let extraField = "";
  if (kategori === "mingguan") {
    const hariOptions = hariList.map(day => 
      `<option value="${day.toLowerCase()}" ${day === 'Sabtu' ? 'selected' : ''}>${day}</option>`
    ).join("");
    extraField = `<select id="deadlineHari" style="width: 100%; padding: 6px; margin-bottom: 8px;">${hariOptions}</select>`;
  } else if (kategori === "bulanan") {
    const now = new Date();
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const tanggalOptions = Array.from({ length: lastDay }, (_, i) => i + 1)
      .map(tgl => `<option value="${tgl}" ${tgl === lastDay ? "selected" : ""}>${tgl}</option>`)
      .join("");
    extraField = `<select id="deadlineTanggal" style="width: 100%; padding: 6px; margin-bottom: 8px;">${tanggalOptions}</select>`;
  }

  $("#formInputs").html(commonFields + extraField).show();
}



$(document).ready(function () {
  function getPriorityColorClass(prioritas) {
    switch (prioritas.toLowerCase()) {
      case "tinggi": return "bg-red-100 text-red-800";
      case "sedang": return "bg-yellow-100 text-yellow-800";
      case "rendah": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-700";
    }
  }

  function renderTugas(jenis, kategori) {
    const container = $('#daftar-rutinitas');
    container.empty();

    const dataTugas = JSON.parse(localStorage.getItem("dataTugas")) || {
      pembentukan: { harian: [], mingguan: [], bulanan: [] },
      pemusnahan: { harian: [], mingguan: [], bulanan: [] }
    };

    const pendingCash = JSON.parse(localStorage.getItem('pendingCash')) || [];
    const tugasList = dataTugas[jenis][kategori] || [];

    tugasList.forEach((tugas, index) => {
      const priorityClass = getPriorityColorClass(tugas.prioritas);
      const isChecked = pendingCash.some(p => p.id_tugas === tugas.id_tugas);
      const card = `
        <label class="block w-full">
          <div class="card shadow-md hover:shadow-lg transition-all duration-300 p-2 rounded-lg bg-white mb-3 border-l-4 border-violet-600 relative overflow-hidden group cursor-pointer select-none">
            <div class="absolute top-0 right-0 w-32 h-32 bg-violet-100 rounded-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div class="flex items-center justify-between relative">
              <div class="flex items-center gap-3">
                <div class="relative">
                  <input type="checkbox"
                    class="checkbox-tugas peer sr-only"
                    data-id="${tugas.id_tugas}"
                    data-kategori="${kategori}"
                    data-jenis="${jenis}"
                    ${isChecked ? 'checked' : ''}>

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
        </label>`;
      container.append(card);
    });
  }

  let currentJenis = "pembentukan";
  let currentKategori = "harian";
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





  // ===============================
  // ? saat tombol simpan di klik
  // ===============================
  $('#btnSimpan').click(function () {
    const jenis = $('#jenisHabit').val();
    const kategori = $('#kategoriTugas').val();
    const namaTugas = $('#namaTugas').val().trim();
    const deskripsi = $('#deskripsiTugas').val().trim();
    const prioritas = $('#prioritasTugas').val();
    const nominalHadiah = parseInt($('#nominalHadiah').val());

    let deadlineHari = "";
    let deadlineTanggal = "";

    if (kategori === "mingguan") {
      deadlineHari = $('#deadlineHari').val().trim();
      if (!deadlineHari) {
        alert('Hari deadline wajib diisi untuk tugas mingguan!');
        return;
      }
    }

    if (kategori === "bulanan") {
      deadlineTanggal = $('#deadlineTanggal').val().trim();
      if (!deadlineTanggal) {
        alert('Tanggal deadline wajib diisi untuk tugas bulanan!');
        return;
      }
    }

    if (!jenis || !kategori || !namaTugas || !deskripsi || !prioritas || isNaN(nominalHadiah)) {
      alert('Semua field wajib diisi!');
      return;
    }

    let dataTugas = JSON.parse(localStorage.getItem("dataTugas")) || {
      pembentukan: { harian: [], mingguan: [], bulanan: [] },
      pemusnahan: { harian: [], mingguan: [], bulanan: [] },
    };

    const semuaTugas = [
      ...dataTugas.pembentukan.harian,
      ...dataTugas.pembentukan.mingguan,
      ...dataTugas.pembentukan.bulanan,
      ...dataTugas.pemusnahan.harian,
      ...dataTugas.pemusnahan.mingguan,
      ...dataTugas.pemusnahan.bulanan
    ];

    const newTugas = {
      judul: namaTugas,
      deskripsi: deskripsi,
      prioritas: prioritas,
      poin: nominalHadiah,
      id_tugas: generateIdUnik(semuaTugas)
    };

    if (kategori === "mingguan") {
      newTugas.deadlineHari = deadlineHari;
    } else if (kategori === "bulanan") {
      newTugas.deadlineTanggal = deadlineTanggal;
    }

    dataTugas[jenis][kategori].push(newTugas);
    localStorage.setItem("dataTugas", JSON.stringify(dataTugas));

    $('#formInputs').html('').addClass('hidden');
    $('#formContainer').addClass('hidden');
    $('#btnSimpan').addClass('hidden');
    $('#jenisHabit').val("");
    $('#kategoriTugas').val("");
    $('#kategoriGroup').addClass('hidden');
    renderTugas(currentJenis, currentKategori);
    $('#formContainer').addClass('hidden')
  });
});

$("#toggleSettings").click(function () {
  $("#pengaturanPanel").toggleClass("translate-x-full");
});






function renderPengaturanTugas() {
  const container = document.getElementById("daftarPengaturanTugas");
  container.innerHTML = "";
  const data = JSON.parse(localStorage.getItem("dataTugas")) || {
    pembentukan: { harian: [], mingguan: [], bulanan: [] },
    pemusnahan: { harian: [], mingguan: [], bulanan: [] },
  };

  Object.entries(data).forEach(([jenis, kategoriObj]) => {
    Object.entries(kategoriObj).forEach(([kategori, tugasList]) => {
      tugasList.forEach((tugas, index) => {
        const elemen = document.createElement("div");
        elemen.className = "flex justify-between items-center p-1 bg-violet-50 rounded shadow-sm";
        elemen.innerHTML = `
          <div>
            <p class="text-sm font-medium text-gray-800">${tugas.judul} ${jenis} - ${kategori}</p>
            <p class="text-xs text-gray-500"></p>
          </div>
          <div class="flex gap-2">
            <button class="edit-btn text-blue-600 text-sm" data-jenis="${jenis}" data-kategori="${kategori}" data-index="${index}">Edit</button>
            <button class="delete-btn text-red-600 text-sm" data-jenis="${jenis}" data-kategori="${kategori}" data-index="${index}">Hapus</button>
          </div>`;
        container.appendChild(elemen);
      });
    });
  });
}

// * tombol toggle sidebar
document.getElementById("daftarPengaturanTugas").addEventListener("click", function (e) {
  if (e.target.classList.contains("delete-btn")) {
    const jenis = e.target.dataset.jenis;
    const kategori = e.target.dataset.kategori;
    const index = parseInt(e.target.dataset.index);
    const data = JSON.parse(localStorage.getItem("dataTugas"));
    data[jenis][kategori].splice(index, 1);
    localStorage.setItem("dataTugas", JSON.stringify(data));
    renderPengaturanTugas();
  } else if (e.target.classList.contains("edit-btn")) {
    alert("Fitur edit akan ditambahkan nanti.");
  }
});

renderPengaturanTugas();




// *fungsi buatkan id unik
function generateIdUnik(dataTugas) {
  const karakter = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  let id;
  do {
    id = "";
    for (let i = 0; i < 4; i++) {
      id += karakter.charAt(Math.floor(Math.random() * karakter.length));
    }
  } while (dataTugas.some(tugas => tugas.id_tugas === id));
  return id;
}




// ============================================================
// ?-bagian masukan tugas ke daftar pending saat di checklis
// ============================================================
$(document).on('change', '.checkbox-tugas', function () {
  const isChecked = $(this).is(':checked');
  const idTugas = $(this).data('id');
  const kategori = $(this).data('kategori');
  const jenis = $(this).data('jenis');

  const semuaTugas = JSON.parse(localStorage.getItem('dataTugas')) || {
    pembentukan: { harian: [], mingguan: [], bulanan: [] },
    pemusnahan: { harian: [], mingguan: [], bulanan: [] }
  };

  let pendingCash = JSON.parse(localStorage.getItem('pendingCash')) || [];
  const daftar = semuaTugas[jenis][kategori];
  const tugas = daftar.find(t => t.id_tugas === idTugas);

  if (!tugas) return;
  if (isChecked) {
    pendingCash.push({
      id_tugas: tugas.id_tugas,
      judul: tugas.judul,
      nominal: tugas.poin,
      kategori: kategori,
      jenis: jenis,
      waktuTambah: new Date().toISOString()
    });
  } else {
    pendingCash = pendingCash.filter(u => u.id_tugas !== idTugas);
  }
  localStorage.setItem('pendingCash', JSON.stringify(pendingCash));
});

