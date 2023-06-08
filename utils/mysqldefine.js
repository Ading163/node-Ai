const { Sequelize, DataTypes } = require('sequelize');

const path = '';// 本地数据库

const sequelize = new Sequelize(path, {
    define: {
        freezeTableName: true
    }
});

// ips_asset实例
const Asset = sequelize.define('ips_asset', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    owner: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '...',
    },
    description: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    kid_1: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '...',
    },
    kid_2: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    kid_3: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    set_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '...',
    },
    width: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    height: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    mime: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    ratio: {
        type: DataTypes.TINYINT,
        allowNull: false,
    },
    dpi: {
        type: DataTypes.TINYINT,
        allowNull: false,
    },
    sample: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    audit_through: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '...',
    },
    deleted: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    created: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    updated: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    is_zb: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0,
    },
    createdAt: {
        field: 'created',
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    updatedAt: {
        field: 'updated',
        type: DataTypes.DATE,
        allowNull: true,
    },

}, {
    tableName: 'ips_asset',
    indexes: [
        { name: 'uid', fields: ['kid_1', 'deleted', 'owner', 'audit_through'] },
        { name: 'audit', fields: ['audit_through'] },
        { name: 'created', fields: ['created'] },
        { name: 'dpi', fields: ['dpi'] },
        { name: 'kid_2', fields: ['kid_2'] },
        { name: 'owner', fields: ['owner'] },
        { name: 'audit_through_2', fields: ['audit_through', 'deleted'] },
        { name: 'id_2', fields: ['id', 'audit_through', 'kid_1', 'deleted'] },
    ],
});

// ips_asset_clip 实例
const IpsAssetClip = sequelize.define('ips_asset_clip', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    description: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    sourceText: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    type: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
}, {
    timestamps: false, // 禁用 timestamps
    tableName: 'ips_asset_clip',
});



const IpsTemplateClip = sequelize.define('ips_template_clip', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    unique_id: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    sourceText: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    type: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
}, {
    timestamps: false, // 禁用 timestamps
    tableName: 'ips_template_clip',
});

// 定义 IpsAsset64 模型
const IpsAsset64 = sequelize.define('ips_asset_64', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true, // 将 id 字段标记为主键
        allowNull: false
    },
    sample: {
        type: DataTypes.STRING,
        allowNull: true
    },
    created: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'ips_asset_64',
    timestamps: false
});



// ips_asset_clip 实例
const IpsAsset64Clip = sequelize.define('ips_asset_64_clip', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    description: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    sourceText: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    type: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
}, {
    timestamps: false, // 禁用 timestamps
    tableName: 'ips_asset_64_clip',
});




module.exports = { Asset, IpsAssetClip, IpsTemplateClip, IpsAsset64, IpsAsset64Clip };