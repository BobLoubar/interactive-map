// Initialisation de la carte centrée sur Argenteuil (48.9477, 2.2477)
var map = L.map('map').setView([48.9477, 2.2477], 13);

// Ajout des tuiles OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Ajout d'un marqueur Outil en main
var customIcon = L.icon({
    iconUrl: 'https://img.icons8.com/?size=100&id=21081&format=png&color=000000', // Lien vers l'icône personnalisée
    iconSize: [25, 25], // Taille de l'icône
    iconAnchor: [12.5, 12.5], // Point de l'icône qui sera au point du marqueur
    popupAnchor: [-4, -15] // Point depuis l'ancre où apparaîtra la popup
});
var marker = L.marker([48.94060424918679, 2.2364254535279544], { icon: customIcon }).addTo(map);
marker.bindPopup("<b>L'Outil en Main</b>");
marker.on('click', function(e) {
    this.openPopup();
});

// Marqueurs Vignes
var customIconVignes = L.icon({
    iconUrl: 'https://img.icons8.com/?size=100&id=vnwvFJpUeg6L&format=png&color=000000', 
    iconSize: [25, 25], 
    iconAnchor: [12.5, 12.5], 
    popupAnchor: [-4, -15]
});
var lieux = [
    { coords: [48.965208, 2.221506], nom: "Les Coteaux d'Argenteuil" },
    { coords: [48.968559, 2.241287], nom: "Vin de Sannois" }
];
lieux.forEach(function(lieu) {
    var marker = L.marker(lieu.coords, { icon: customIconVignes }).addTo(map);
    marker.bindPopup("<b>" + lieu.nom + "</b>");
    marker.on('click', function(e) {
        this.openPopup();
    });
});

// Fichier GeoJSON - Quartiers d'Argenteuil

// Fonction pour styliser le contour
function styleContour(feature) {
    return {
        color: 'red',      // Couleur du contour
        weight: 2,         // Épaisseur de la ligne
        opacity: 1,         // Opacité de la ligne
        fillColor: 'none', // Pas de couleur de remplissage
        fillOpacity: 0     // Pas de remplissage visible
    };
}
// Upload du fichier geojson
fetch('Les_quartiers.geojson')
    .then(response => {
        if (!response.ok) {
            throw new Error('Erreur lors du chargement du fichier GeoJSON');
        }
        return response.json();
    })
    .then(data => {
        L.geoJSON(data, {
            style: styleContour
        }).addTo(map);
    })
    .catch(error => {
        console.error('Erreur:', error);
    });

// Fichier GeoJSON - La plaine d'Argenteuil
function styleContour2(feature) {
    return {
        color: 'blue',      
        weight: 2,         
        opacity: 1,         
    };
}

var plaineLayerGroup = L.layerGroup();
fetch('La_Plaine_Argenteuil.geojson')
    .then(response => {
        if (!response.ok) {
            throw new Error('Erreur lors du chargement du fichier GeoJSON');
        }
        return response.json();
    })
    .then(data => {
        var plaineLayer = L.geoJSON(data, {
            style: styleContour2,
            onEachFeature: function(feature, layer) {
                const Name_Plaine_Argenteuil = "<b>La plaine d'Argenteuil (projet maraîcher 2026)</b>";
                layer.on('click', function() {
                    layer.bindPopup(Name_Plaine_Argenteuil).openPopup();
                });
            }
        });
        plaineLayerGroup.addLayer(plaineLayer);
    })
    .catch(error => {
        console.error('Erreur:', error);
    });

// Fichier GeoJSON - Les PAE d'Argenteuil
function styleContour3(feature) {
    return {
        color: 'green',      
        weight: 2,         
        opacity: 1,         
    };
}

var paeLayerGroup = L.layerGroup();
fetch('Les_parcs_d_Activités_Economiques_à_Argenteuil.geojson')
    .then(response => {
        if (!response.ok) {
            throw new Error('Erreur lors du chargement du fichier GeoJSON');
        }
        return response.json();
    })
    .then(data => {
        var paeLayer = L.geoJSON(data, {
            style: styleContour3,
            onEachFeature: function(feature, layer) {
                const zoneName = feature.properties.NOM_SECTEU;
                layer.on('click', function() {
                    layer.bindPopup(`<b>${zoneName}</b>`).openPopup();
                });
            }
        });
        paeLayerGroup.addLayer(paeLayer);
    })
    .catch(error => {
        console.error('Erreur:', error);
    });

// Fichier GeoJSON - Les QPV d'Argenteuil
function styleContour4(feature) {
    return {
        color: 'yellow',      
        weight: 2,            
        opacity: 1,           
    };
}

var qpvLayerGroup = L.layerGroup();
fetch('votre_fichier_wgs84.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Erreur lors du chargement du fichier GeoJSON');
        }
        return response.json();
    })
    .then(data => {
        var qpvLayer = L.geoJSON(data, {
            style: styleContour4,
            onEachFeature: function(feature, layer) {
                const zoneName = feature.properties.nom_quartier;
                layer.bindPopup(`<b>${zoneName}</b>`);
                qpvLayerGroup.addLayer(layer);
            }
        });
        qpvLayerGroup.addLayer(qpvLayer);
    })
    .catch(error => {
        console.error('Erreur:', error);
    });

// Ajouter une légende avec un contrôle interactif pour les différentes zones
var overlays = {
    "La Plaine d'Argenteuil": plaineLayerGroup,
    "Parcs d'Activités Économiques": paeLayerGroup,
    "Quartiers prioritaires": qpvLayerGroup
};

// Ajouter le contrôle de couches à la carte (couches visibles/cachées)
L.control.layers(null, overlays).addTo(map);
