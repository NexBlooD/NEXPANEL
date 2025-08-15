
class GRoleBaseModel {
    static getFields(version) {
        const fields = [
            { name: 'type', method: 'readCUInt32' },
            { name: 'answlen', method: 'readCUInt32' },
            { name: 'localsid', method: 'readInt32' },
            { name: 'retcode', method: 'readInt32' },
            { name: 'version', method: 'readUByte' },
            { name: 'id', method: 'readInt32' },
            { name: 'name', method: 'readUString' },
            { name: 'race', method: 'readInt32' },
            { name: 'cls', method: 'readInt32' },
            { name: 'gender', method: 'readUByte' },
            { name: 'custom_data', method: 'readOctets' },
            { name: 'config_data', method: 'readOctets' },
            { name: 'custom_stamp', method: 'readUInt32' },
            { name: 'status', method: 'readUByte' },
            { name: 'delete_time', method: 'readUInt32' },
            { name: 'create_time', method: 'readUInt32' },
            { name: 'lastlogin_time', method: 'readUInt32' },
            { name: 'forbid', method: 'readOctets' },
            { name: 'help_states', method: 'readOctets' },
            { name: 'spouse', method: 'readUInt32' },
            { name: 'userid', method: 'readUInt32' },
            { name: 'cross_data', method: 'readOctets' },
        ];

        if (version < 80) {
            fields.push({ name: 'reserved2', method: 'readUByte' });
        } else {
            fields.push({ name: 'custom_data_highmode', method: 'readOctets' });
        }

        fields.push(
            { name: 'reserved3', method: 'readUByte' },
            { name: 'reserved4', method: 'readUByte' }
        );

        return fields;
    }
}

module.exports = GRoleBaseModel;
