function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
import { Exclude, Expose } from "class-transformer";
import { IsEmail, IsNumber, IsString } from "class-validator";
export let UserView = class UserView {
    id;
    name;
    email;
};
_ts_decorate([
    Expose(),
    IsNumber(),
    _ts_metadata("design:type", Number)
], UserView.prototype, "id", void 0);
_ts_decorate([
    Expose(),
    IsString(),
    _ts_metadata("design:type", String)
], UserView.prototype, "name", void 0);
_ts_decorate([
    Expose(),
    IsEmail(),
    _ts_metadata("design:type", String)
], UserView.prototype, "email", void 0);
UserView = _ts_decorate([
    Exclude()
], UserView);

//# sourceMappingURL=user.view.js.map