const { Sequelize, DataTypes } = require('sequelize');

const pathOnline = ''; // 线上数据库地址

const sequelizeOnline = new Sequelize(pathOnline, {
    define: {
        freezeTableName: true
    }
});

// ips_asset实例
const onLineAsset = sequelizeOnline.define('ips_asset', {
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

// 定义模型
const onIpsAssetClip = sequelizeOnline.define('ips_asset_clip', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
    },
    sourceText: {
        type: DataTypes.STRING(2000),
        allowNull: false,
        comment: '原始文本',
    },
    description: {
        type: DataTypes.STRING(2000),
        allowNull: false,
        comment: '翻译文本',
    },
    created: {
        type: DataTypes.DATE,
        defaultValue: '2023-05-24 00:00:00',
    },
}, {
    tableName: 'ips_asset_clip',
    timestamps: false, // 如果表中没有createdAt和updatedAt字段，可以将其设置为false
    // underscored: true, // 如果列名使用下划线命名（如source_text），可以将其设置为true
    charset: 'utf8',
    collate: 'utf8_unicode_ci',
    engine: 'InnoDB',
    rowFormat: 'DYNAMIC',
});
// 查询模板原始id的库
const onIpsTmpUnique = sequelizeOnline.define('ips_tmp_unique', {
    unique_id: {
        type: DataTypes.STRING(20),
        primaryKey: true,
        allowNull: false,
        comment: '随机不重复字符'
    },
    tpl_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        comment: '用户模板id'
    },
    create_time: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        comment: '创建时间'
    }
}, {
    tableName: 'ips_tmp_unique',
    timestamps: false, // 如果不需要 createdAt 和 updatedAt 字段，可以设置为 false
});

// 查询原始id的预览图
const onIpsTemplate = sequelizeOnline.define('ips_template', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    preview: {
        type: DataTypes.STRING(5000),
        allowNull: true,
        comment: '预览图 多张的话以英文逗号分割'
    },
}, {
    tableName: 'ips_template',
    timestamps: false,
    // 其他配置项...
});


// 用户模板编辑素材
const onIpsUserTemplateEditAsset = sequelizeOnline.define('ips_user_template_edit_asset', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    templ_id: {
        type: DataTypes.INTEGER
    },
    user_templ_id: {
        type: DataTypes.INTEGER
    },
    type: {
        type: DataTypes.STRING(50)
    },
    asset_id: {
        type: DataTypes.INTEGER
    },
    source: {
        type: DataTypes.STRING(255)
    },
    created: {
        type: DataTypes.DATE
    }
}, {
    tableName: 'ips_user_template_edit_asset',
    timestamps: false
});

const onIpsBanWords = sequelizeOnline.define('ips_ban_words', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    word: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
}, {
    tableName: 'ips_ban_words',
    timestamps: false
});


module.exports = { onLineAsset, onIpsTmpUnique, onIpsTemplate, onIpsUserTemplateEditAsset, onIpsBanWords, onIpsAssetClip };