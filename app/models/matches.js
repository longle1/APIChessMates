const matchesModel = require(__path_schemas + "matches");
module.exports = {
    createRoom: async (body) => {
        const {id, betPoints, roomName, ownerRoom, ipRoom} = {...body};
        const arrays = [];
        const object = { user: id };
        arrays.push(object);
        return room = await matchesModel.create({ players: arrays, betPoints , roomName, ownerRoom, ipRoom });
    },
    getListRooms: async () => {
        return await matchesModel.find({});
    },
    join_Exit_Room: async (req) => {
        //tìm phòng theo id
        const room = await matchesModel.findOne({ _id: req.params.id });
        if (req.body.option.toLocaleLowerCase() === "adduser") {
            if (room.players.length === 1) {
                const object = { user: req.body.id };
                room.players.push(object);
                room.count += 1;
                room.status = "fighting";
            }else {
                return false;
            }
        } else if (req.body.option.toLocaleLowerCase() === "subuser") {
            //khi người dùng thoát khỏi phòng đấu thì chỉ cần xóa id đó là được
            room.players.forEach((player, index) => {
                if (player.user.toString() === req.body.id) {
                    room.count -= 1;
                    room.players.splice(index, 1);
                }
            })
            room.status = "waiting";
        }
        await room.save();
        return room;
    },
    finished_Room: async (req) => {
        const room = await matchesModel.findOne({ _id: req.params.id });
        //thực hiện chỉnh sửa kết quả trận đấu cho cho user tương ứng 
        const player1 = req.body.player1.split('-');    //dạng id-result
        const player2 = req.body.player2.split('-');
        room.players.forEach(player => {
            if (player.user.toString() === player1[0]) player.resultMatch = player1[1];
            else if (player.user.toString() === player2[0]) player.resultMatch = player2[1];
        });
        //tự động cập nhật trạng thái của trận đấu sang kết thúc
        room.status = "finished";
        await room.save();
        return room;
    },
    deleteRoom: async (id) => {
        return await matchesModel.findOneAndDelete({ _id: id });
    },
    deleteAllRoom: async () => {
        return await matchesModel.deleteMany({});
    }
}